import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';
import ideaValidationService from '../services/ideaValidationService';
import Button from '../components/Button';

const IdeaValidator = () => {
  // Authentication & User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    ideaName: '',
    ideaDescription: '',
    // C.N.E.S.T. Scores (1-10)
    curiosity: 5,
    need: 5,
    ease: 5,
    scale: 5,
    time: 5
  });

  // Calculated Results
  const [results, setResults] = useState({
    totalScore: 0,
    averageScore: 0,
    verdict: '',
    recommendation: '',
    strengths: [],
    improvements: []
  });

  // C.N.E.S.T. Framework Questions
  const steps = [
    {
      id: 'intro',
      title: 'ยินดีต้อนรับสู่ Idea Validator',
      subtitle: 'เครื่องมือประเมินความเป็นไปได้ของไอเดียธุรกิจ',
      type: 'intro'
    },
    {
      id: 'idea-info',
      title: 'ข้อมูลไอเดียของคุณ',
      subtitle: 'บอกเราเกี่ยวกับไอเดียธุรกิจที่คุณต้องการประเมิน',
      type: 'form'
    },
    {
      id: 'curiosity',
      title: '🔍 Curiosity - ความน่าสนใจ',
      subtitle: 'ไอเดียของคุณทำให้คนอื่นสนใจและอยากรู้มากแค่ไหน?',
      question: 'เมื่อคุณเล่าเรื่องไอเดียนี้ให้คนอื่นฟัง พวกเขามักจะมีปฏิกิริยาอย่างไร?',
      type: 'cnest',
      key: 'curiosity',
      options: [
        { value: 1, label: 'ไม่มีใครสนใจ หรือคิดว่าแปลก' },
        { value: 3, label: 'บางคนสนใจ แต่ส่วนใหญ่เฉยๆ' },
        { value: 5, label: 'คนส่วนใหญ่สนใจ แต่ไม่ถึงกับตื่นเต้น' },
        { value: 7, label: 'หลายคนสนใจและถามคำถามต่อ' },
        { value: 10, label: 'ทุกคนตื่นเต้นและอยากรู้รายละเอียดเพิ่ม' }
      ]
    },
    {
      id: 'need',
      title: '🎯 Need - ความจำเป็น',
      subtitle: 'ไอเดียของคุณตอบโจทย์ความต้องการที่แท้จริงมากแค่ไหน?',
      question: 'คนกลุ่มเป้าหมายของคุณมีปัญหาหรือความต้องการในเรื่องนี้จริงหรือไม่?',
      type: 'cnest',
      key: 'need',
      options: [
        { value: 1, label: 'เป็นแค่ Nice to have ไม่มีก็ได้' },
        { value: 3, label: 'มีบ้าง แต่ไม่รุนแรงมาก' },
        { value: 5, label: 'เป็นปัญหาที่น่ารำคาญพอสมควร' },
        { value: 7, label: 'เป็นปัญหาที่คนยอมจ่ายเงินแก้' },
        { value: 10, label: 'เป็นปัญหาร้ายแรงที่ต้องแก้ด่วน' }
      ]
    },
    {
      id: 'ease',
      title: '⚡ Ease - ความง่าย',
      subtitle: 'ไอเดียของคุณทำได้ง่ายแค่ไหนด้วยทรัพยากรที่มี?',
      question: 'ด้วยทักษะ เวลา และงบประมาณที่คุณมี คุณสามารถทำไอเดียนี้ได้ระดับไหน?',
      type: 'cnest',
      key: 'ease',
      options: [
        { value: 1, label: 'ยากมาก ต้องใช้เวลาและเงินเป็นล้าน' },
        { value: 3, label: 'ยากพอสมควร ต้องเรียนรู้เยอะ' },
        { value: 5, label: 'ปานกลาง ทำได้แต่ต้องใช้เวลา' },
        { value: 7, label: 'ค่อนข้างง่าย ทำได้ภายในไม่กี่เดือน' },
        { value: 10, label: 'ง่ายมาก เริ่มได้ทันทีด้วยทรัพยากรที่มี' }
      ]
    },
    {
      id: 'scale',
      title: '📈 Scale - ความใหญ่โต',
      subtitle: 'ไอเดียของคุณสามารถขยายใหญ่ได้มากแค่ไหน?',
      question: 'ตลาดสำหรับไอเดียนี้มีขนาดแค่ไหน และสามารถขยายได้มากแค่ไหน?',
      type: 'cnest',
      key: 'scale',
      options: [
        { value: 1, label: 'ตลาดเล็ก เฉพาะกลุ่มคนเล็กๆ' },
        { value: 3, label: 'ตลาดเฉพาะทำเล หรือกลุ่มคนเฉพาะ' },
        { value: 5, label: 'ตลาดระดับภูมิภาค หรือประเทศ' },
        { value: 7, label: 'ตลาดใหญ่ ขยายได้หลายประเทศ' },
        { value: 10, label: 'ตลาดโลก ทุกคนต้องการ' }
      ]
    },
    {
      id: 'time',
      title: '⏰ Time - จังหวะเวลา',
      subtitle: 'ตอนนี้เป็นจังหวะเวลาที่เหมาะสมสำหรับไอเดียนี้หรือไม่?',
      question: 'เทรนด์ตลาด เทคโนโลยี และสถานการณ์ปัจจุบัน เอื้อต่อไอเดียนี้แค่ไหน?',
      type: 'cnest',
      key: 'time',
      options: [
        { value: 1, label: 'ยังเร็วเกินไป หรือสายเกินไป' },
        { value: 3, label: 'เวลาไม่ค่อยเหมาะ แต่ยังทำได้' },
        { value: 5, label: 'เวลาปกติ ไม่ดีไม่เลว' },
        { value: 7, label: 'เวลาที่ดี เทรนด์เริ่มขึ้น' },
        { value: 10, label: 'เวลาที่สมบูรณ์แบบ เทรนด์กำลังมา' }
      ]
    },
    {
      id: 'results',
      title: '🎉 ผลการประเมิน',
      subtitle: 'ผลการวิเคราะห์ไอเดียของคุณด้วยระบบ C.N.E.S.T.',
      type: 'results'
    }
  ];

  // Authentication Check
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        window.location.hash = '#auth';
      }
    });

    return () => unsubscribe();
  }, []);

  // Calculate Results whenever CNEST scores change
  useEffect(() => {
    calculateResults();
  }, [formData.curiosity, formData.need, formData.ease, formData.scale, formData.time]);

  // Calculate C.N.E.S.T. Results
  const calculateResults = () => {
    const { curiosity, need, ease, scale, time } = formData;
    const totalScore = curiosity + need + ease + scale + time;
    const averageScore = totalScore / 5;

    let verdict = '';
    let recommendation = '';
    const strengths = [];
    const improvements = [];

    // Score Analysis
    const scores = { curiosity, need, ease, scale, time };
    const scoreNames = {
      curiosity: 'ความน่าสนใจ',
      need: 'ความจำเป็น',
      ease: 'ความง่าย',
      scale: 'ความใหญ่โต',
      time: 'จังหวะเวลา'
    };

    // Find strengths (score >= 7)
    Object.entries(scores).forEach(([key, score]) => {
      if (score >= 7) {
        strengths.push(scoreNames[key]);
      } else if (score <= 4) {
        improvements.push(scoreNames[key]);
      }
    });

    // Overall Verdict
    if (averageScore >= 8) {
      verdict = '🚀 ไอเดียเจ๋ง! เริ่มลงมือทำได้เลย';
      recommendation = 'ไอเดียของคุณมีศักยภาพสูงมาก! ควรเริ่มต้นโดยการทำ MVP (Minimum Viable Product) และทดสอบกับลูกค้ากลุ่มแรก';
    } else if (averageScore >= 6.5) {
      verdict = '👍 ไอเดียดี แต่ต้องปรับปรุงบางจุด';
      recommendation = 'ไอเดียของคุณมีศักยภาพ แต่ควรปรับปรุงในจุดที่ยังอ่อนก่อนลงทุนใหญ่';
    } else if (averageScore >= 5) {
      verdict = '🤔 ไอเดียปานกลาง ควรพิจารณาใหม่';
      recommendation = 'ไอเดียของคุณยังต้องพัฒนาเพิ่ม หรืออาจต้องหาไอเดียใหม่ที่ดีกว่า';
    } else {
      verdict = '⚠️ ไอเดียนี้มีความเสี่ยงสูง';
      recommendation = 'ควรหาไอเดียใหม่ที่มีศักยภาพมากกว่า หรือปรับปรุงไอเดียนี้ใหญ่';
    }

    setResults({
      totalScore,
      averageScore,
      verdict,
      recommendation,
      strengths,
      improvements
    });
  };

  // Handle form input changes
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToResults = () => {
    setCurrentStep(steps.length - 1);
    setShowResults(true);
  };

  // Save results to Firestore
  const saveResults = async () => {
    if (!user) return;

    try {
      const resultData = {
        userId: user.uid,
        userEmail: user.email,
        ideaName: formData.ideaName,
        ideaDescription: formData.ideaDescription,
        scores: {
          curiosity: formData.curiosity,
          need: formData.need,
          ease: formData.ease,
          scale: formData.scale,
          time: formData.time
        },
        results: results
      };

      // Save to Firestore using ideaValidationService
      await ideaValidationService.saveValidation(resultData);

      alert('✅ บันทึกผลการประเมินเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('❌ เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบก่อนใช้เครื่องมือประเมินไอเดีย</p>
          <Button variant="primary" onClick={() => window.location.hash = '#auth'}>
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => window.location.hash = '#dashboard'}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← กลับ
              </button>
              <h1 className="text-xl font-bold text-gray-900">Idea Validator</h1>
            </div>
            <div className="text-sm text-gray-500">
              ขั้นตอน {currentStep + 1} จาก {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step Content */}
          {currentStepData.type === 'intro' && (
            <div className="text-center">
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🚀</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {currentStepData.subtitle}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  ระบบประเมิน C.N.E.S.T.
                </h3>
                <div className="grid md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="font-semibold">Curiosity</div>
                    <div className="text-gray-600">ความน่าสนใจ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold">Need</div>
                    <div className="text-gray-600">ความจำเป็น</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-semibold">Ease</div>
                    <div className="text-gray-600">ความง่าย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-semibold">Scale</div>
                    <div className="text-gray-600">ความใหญ่โต</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⏰</div>
                    <div className="font-semibold">Time</div>
                    <div className="text-gray-600">จังหวะเวลา</div>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                onClick={nextStep}
              >
                เริ่มประเมินไอเดีย →
              </Button>
            </div>
          )}

          {currentStepData.type === 'form' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {currentStepData.subtitle}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    ชื่อไอเดียธุรกิจ
                  </label>
                  <input
                    type="text"
                    value={formData.ideaName}
                    onChange={(e) => handleInputChange('ideaName', e.target.value)}
                    placeholder="เช่น แอปจัดการเวลาสำหรับนักเรียน"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    รายละเอียดไอเดีย
                  </label>
                  <textarea
                    value={formData.ideaDescription}
                    onChange={(e) => handleInputChange('ideaDescription', e.target.value)}
                    placeholder="อธิบายไอเดียของคุณโดยสังเขป..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="secondary" onClick={prevStep}>
                  ← ย้อนกลับ
                </Button>
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  disabled={!formData.ideaName || !formData.ideaDescription}
                >
                  ต่อไป →
                </Button>
              </div>
            </div>
          )}

          {currentStepData.type === 'cnest' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {currentStepData.subtitle}
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <p className="text-lg text-gray-800 font-medium">
                  {currentStepData.question}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {currentStepData.options.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData[currentStepData.key] === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentStepData.key}
                      value={option.value}
                      checked={formData[currentStepData.key] === option.value}
                      onChange={(e) => handleInputChange(currentStepData.key, parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        formData[currentStepData.key] === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData[currentStepData.key] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          คะแนน {option.value}/10
                        </div>
                        <div className="text-gray-600">
                          {option.label}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Real-time Score Display */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formData[currentStepData.key]}/10
                  </div>
                  <div className="text-sm text-gray-600">
                    คะแนนรวมปัจจุบัน: {results.totalScore}/50 | เฉลี่ย: {results.averageScore.toFixed(1)}/10
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={prevStep}>
                  ← ย้อนกลับ
                </Button>
                <Button variant="primary" onClick={nextStep}>
                  ต่อไป →
                </Button>
              </div>
            </div>
          )}

          {currentStepData.type === 'results' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Score Breakdown */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">คะแนนรายละเอียด</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>🔍 Curiosity (ความน่าสนใจ)</span>
                      <span className="font-bold text-blue-600">{formData.curiosity}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>🎯 Need (ความจำเป็น)</span>
                      <span className="font-bold text-green-600">{formData.need}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>⚡ Ease (ความง่าย)</span>
                      <span className="font-bold text-yellow-600">{formData.ease}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>📈 Scale (ความใหญ่โต)</span>
                      <span className="font-bold text-purple-600">{formData.scale}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>⏰ Time (จังหวะเวลา)</span>
                      <span className="font-bold text-red-600">{formData.time}/10</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>คะแนนรวม</span>
                      <span className="text-2xl text-blue-600">{results.totalScore}/50</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>คะแนนเฉลี่ย</span>
                      <span className="text-2xl text-purple-600">{results.averageScore.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>

                {/* Verdict */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">ผลการประเมิน</h3>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{results.verdict.split(' ')[0]}</div>
                    <div className="text-xl font-bold text-gray-800 mb-4">
                      {results.verdict.substring(2)}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {results.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {results.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-3">🎯 จุดแข็ง</h4>
                    <ul className="space-y-2">
                      {results.strengths.map((strength, index) => (
                        <li key={index} className="text-green-700">
                          ✅ {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.improvements.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-3">🔧 ควรปรับปรุง</h4>
                    <ul className="space-y-2">
                      {results.improvements.map((improvement, index) => (
                        <li key={index} className="text-orange-700">
                          ⚠️ {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={saveResults}
                >
                  📊 บันทึกผลการประเมิน
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => {
                    setCurrentStep(0);
                    setFormData({
                      ideaName: '',
                      ideaDescription: '',
                      curiosity: 5,
                      need: 5,
                      ease: 5,
                      scale: 5,
                      time: 5
                    });
                  }}
                >
                  🔄 ประเมินไอเดียใหม่
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.location.hash = '#dashboard'}
                >
                  🏠 กลับ Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IdeaValidator;