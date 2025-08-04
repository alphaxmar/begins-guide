import { 
  collection,
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from './firebase';

class IdeaValidationService {
  
  /**
   * Save idea validation results to Firestore
   * @param {Object} validationData - The validation data to save
   * @returns {Promise} Document reference
   */
  async saveValidation(validationData) {
    try {
      const docId = `${validationData.userId}_${Date.now()}`;
      const docRef = doc(firestore, 'idea-validations', docId);
      
      const dataToSave = {
        ...validationData,
        id: docId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, dataToSave);
      return docRef;
    } catch (error) {
      console.error('Error saving validation:', error);
      throw error;
    }
  }

  /**
   * Get all validations for a specific user
   * @param {string} userId - User ID
   * @param {number} limitCount - Limit number of results
   * @returns {Promise} Array of validation documents
   */
  async getUserValidations(userId, limitCount = 50) {
    try {
      const validationsRef = collection(firestore, 'idea-validations');
      const q = query(
        validationsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user validations:', error);
      throw error;
    }
  }

  /**
   * Get a specific validation by ID
   * @param {string} validationId - Validation document ID
   * @returns {Promise} Validation document data
   */
  async getValidation(validationId) {
    try {
      const docRef = doc(firestore, 'idea-validations', validationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Validation not found');
      }
    } catch (error) {
      console.error('Error getting validation:', error);
      throw error;
    }
  }

  /**
   * Update an existing validation
   * @param {string} validationId - Validation document ID
   * @param {Object} updateData - Data to update
   * @returns {Promise}
   */
  async updateValidation(validationId, updateData) {
    try {
      const docRef = doc(firestore, 'idea-validations', validationId);
      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      return await updateDoc(docRef, dataToUpdate);
    } catch (error) {
      console.error('Error updating validation:', error);
      throw error;
    }
  }

  /**
   * Delete a validation
   * @param {string} validationId - Validation document ID
   * @returns {Promise}
   */
  async deleteValidation(validationId) {
    try {
      const docRef = doc(firestore, 'idea-validations', validationId);
      return await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting validation:', error);
      throw error;
    }
  }

  /**
   * Get validation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise} Statistics object
   */
  async getUserStats(userId) {
    try {
      const validations = await this.getUserValidations(userId);
      
      const stats = {
        totalValidations: validations.length,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 10,
        topCategories: {
          curiosity: 0,
          need: 0,
          ease: 0,
          scale: 0,
          time: 0
        },
        recentValidations: validations.slice(0, 5)
      };

      if (validations.length > 0) {
        let totalAverage = 0;
        const categoryTotals = { curiosity: 0, need: 0, ease: 0, scale: 0, time: 0 };

        validations.forEach(validation => {
          const avgScore = validation.results?.averageScore || 0;
          totalAverage += avgScore;
          
          if (avgScore > stats.highestScore) stats.highestScore = avgScore;
          if (avgScore < stats.lowestScore) stats.lowestScore = avgScore;

          // Sum up category scores
          if (validation.scores) {
            Object.keys(categoryTotals).forEach(category => {
              categoryTotals[category] += validation.scores[category] || 0;
            });
          }
        });

        stats.averageScore = totalAverage / validations.length;
        
        // Calculate average for each category
        Object.keys(categoryTotals).forEach(category => {
          stats.topCategories[category] = categoryTotals[category] / validations.length;
        });
      }

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Calculate CNEST score and provide recommendations
   * @param {Object} scores - CNEST scores object
   * @returns {Object} Analysis results
   */
  calculateCNESTAnalysis(scores) {
    const { curiosity, need, ease, scale, time } = scores;
    const totalScore = curiosity + need + ease + scale + time;
    const averageScore = totalScore / 5;

    let verdict = '';
    let recommendation = '';
    let riskLevel = 'low';
    const strengths = [];
    const improvements = [];

    // Score Analysis
    const scoreNames = {
      curiosity: 'ความน่าสนใจ',
      need: 'ความจำเป็น',
      ease: 'ความง่าย',
      scale: 'ความใหญ่โต',
      time: 'จังหวะเวลา'
    };

    // Find strengths (score >= 7) and improvements (score <= 4)
    Object.entries(scores).forEach(([key, score]) => {
      if (score >= 7) {
        strengths.push(scoreNames[key]);
      } else if (score <= 4) {
        improvements.push(scoreNames[key]);
      }
    });

    // Overall Verdict based on average score
    if (averageScore >= 8) {
      verdict = '🚀 ไอเดียเจ๋ง! เริ่มลงมือทำได้เลย';
      recommendation = 'ไอเดียของคุณมีศักยภาพสูงมาก! ควรเริ่มต้นโดยการทำ MVP (Minimum Viable Product) และทดสอบกับลูกค้ากลุ่มแรก ลงทุนเวลาและงบประมาณเพื่อพัฒนาให้เป็นจริง';
      riskLevel = 'low';
    } else if (averageScore >= 6.5) {
      verdict = '👍 ไอเดียดี แต่ต้องปรับปรุงบางจุด';
      recommendation = 'ไอเดียของคุณมีศักยภาพ แต่ควรปรับปรุงในจุดที่ยังอ่อนก่อนลงทุนใหญ่ ทำการวิจัยเพิ่มเติมและปรับแก้ไอเดียให้ดีขึ้น';
      riskLevel = 'medium';
    } else if (averageScore >= 5) {
      verdict = '🤔 ไอเดียปานกลาง ควรพิจารณาใหม่';
      recommendation = 'ไอเดียของคุณยังต้องพัฒนาเพิ่ม หรืออาจต้องหาไอเดียใหม่ที่ดีกว่า ลองปรับเปลี่ยนแนวทางหรือหาตลาดใหม่';
      riskLevel = 'medium';
    } else {
      verdict = '⚠️ ไอเดียนี้มีความเสี่ยงสูง';
      recommendation = 'ควรหาไอเดียใหม่ที่มีศักยภาพมากกว่า หรือปรับปรุงไอเดียนี้ใหญ่ๆ เพื่อลดความเสี่ยง ไม่แนะนำให้ลงทุนมากในตอนนี้';
      riskLevel = 'high';
    }

    // Specific recommendations based on weak areas
    const specificRecommendations = [];
    
    if (need <= 4) {
      specificRecommendations.push('🔍 ศึกษาความต้องการของตลาดให้ลึกขึ้น อาจต้องหาปัญหาที่ร้ายแรงกว่านี้');
    }
    if (curiosity <= 4) {
      specificRecommendations.push('✨ ทำให้ไอเดียน่าสนใจมากขึ้น อาจต้องเปลี่ยนวิธีนำเสนอ');
    }
    if (ease <= 4) {
      specificRecommendations.push('⚡ หาวิธีทำให้ง่ายขึ้น หรือเริ่มจากเวอร์ชันง่ายๆ ก่อน');
    }
    if (scale <= 4) {
      specificRecommendations.push('📈 หาวิธีขยายตลาดให้ใหญ่ขึ้น หรือเปลี่ยนกลุ่มเป้าหมาย');
    }
    if (time <= 4) {
      specificRecommendations.push('⏰ รอเวลาที่เหมาะสมกว่า หรือหาวิธีให้เทรนด์เข้าข้างเรา');
    }

    return {
      totalScore,
      averageScore: Math.round(averageScore * 10) / 10,
      verdict,
      recommendation,
      riskLevel,
      strengths,
      improvements,
      specificRecommendations
    };
  }
}

// Create a singleton instance
const ideaValidationService = new IdeaValidationService();

export default ideaValidationService;