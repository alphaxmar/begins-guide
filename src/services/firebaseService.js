import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, firestore } from './firebase';

class FirebaseService {
  // Authentication Methods
  
  /**
   * Create a new user account
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} userData - Additional user data
   * @returns {Promise} User credential
   */
  async signUp(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile if displayName provided
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }
      
      // Save additional user data to Firestore
      await this.createUserDocument(user.uid, {
        email: user.email,
        displayName: userData.displayName || '',
        createdAt: new Date().toISOString(),
        ...userData
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }
  
  /**
   * Sign in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} User credential
   */
  async signIn(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }
  
  /**
   * Sign out the current user
   * @returns {Promise}
   */
  async signOut() {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
  
  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise}
   */
  async resetPassword(email) {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
  
  /**
   * Listen to authentication state changes
   * @param {Function} callback - Callback function to handle auth state
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
  
  /**
   * Get current user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return auth.currentUser;
  }
  
  // Firestore Methods
  
  /**
   * Create user document in Firestore
   * @param {string} uid - User ID
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  async createUserDocument(uid, userData) {
    try {
      const userRef = doc(firestore, 'users', uid);
      return await setDoc(userRef, userData);
    } catch (error) {
      console.error('Create user document error:', error);
      throw error;
    }
  }
  
  /**
   * Get user document from Firestore
   * @param {string} uid - User ID
   * @returns {Promise} User document data
   */
  async getUserDocument(uid) {
    try {
      const userRef = doc(firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Get user document error:', error);
      throw error;
    }
  }
  
  /**
   * Update user document in Firestore
   * @param {string} uid - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise}
   */
  async updateUserDocument(uid, updateData) {
    try {
      const userRef = doc(firestore, 'users', uid);
      return await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update user document error:', error);
      throw error;
    }
  }
  
  /**
   * Delete user document from Firestore
   * @param {string} uid - User ID
   * @returns {Promise}
   */
  async deleteUserDocument(uid) {
    try {
      const userRef = doc(firestore, 'users', uid);
      return await deleteDoc(userRef);
    } catch (error) {
      console.error('Delete user document error:', error);
      throw error;
    }
  }
  
  /**
   * Get all users (admin function)
   * @param {number} limitCount - Limit number of results
   * @returns {Promise} Array of user documents
   */
  async getAllUsers(limitCount = 50) {
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
  
  /**
   * Search users by email
   * @param {string} email - Email to search for
   * @returns {Promise} Array of matching user documents
   */
  async searchUsersByEmail(email) {
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const firebaseService = new FirebaseService();

export default firebaseService;