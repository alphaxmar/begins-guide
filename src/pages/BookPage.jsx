import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const BookPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Authentication Check
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePurchase = (option) => {
    // TODO: Integrate with e-commerce platform
    console.log('Purchase option:', option);
    
    // For now, show modal with purchase options
    setShowPurchaseModal(true);
  };

  const PurchaseModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">เลือกช่องทางการสั่งซื้อ</h3>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={() => window.open('https://gumroad.com/your-book', '_blank')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            📱 E-book (ไฟล์ดิจิตอล) - ฿299
          </button>
          
          <button
            onClick={() => window.open('https://shopee.co.th/your-book', '_blank')}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-colors"
          >
            📚 หนังสือกระดาษ - ฿399
          </button>
          
          <button
            onClick={() => window.open('https://your-store.com/bundle', '_blank')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            🎁 Bundle (E-book + กระดาษ) - ฿599
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowPurchaseModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              🎉 เปิดตัวแล้ว! บันไดขั้นที่ 2
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Freedom Engine
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            คู่มือสร้างธุรกิจออนไลน์ที่จะพาคุณจากแค่ "ความฝัน" 
            สู่ "เสรีภาพทางการเงิน" อย่างเป็นระบบ
          </p>

          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <p className="text-green-700 font-medium">
                🎯 คุณได้ใช้ Idea Validator แล้ว! 
                <br />พร้อมสำหรับขั้นตอนต่อไป
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <p className="text-blue-700 font-medium">
                💡 แนะนำ: ลองใช้ Idea Validator ก่อนซื้อหนังสือ
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => window.location.hash = '#auth'}
                className="mt-2"
              >
                ทดลองฟรี →
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => handlePurchase('ebook')}
              className="text-lg px-8 py-4"
            >
              📱 สั่งซื้อ E-book - ฿299
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => handlePurchase('physical')}
              className="text-lg px-8 py-4"
            >
              📚 สั่งซื้อหนังสือกระดาษ - ฿399
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-8">
            💝 <strong>โบนัสพิเศษ:</strong> ได้รหัสลับปลดล็อกสถานะ "Reader" บนแพลตฟอร์ม
          </div>
        </div>
      </section>

      {/* Book Preview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-sm mx-auto">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-2">The Freedom Engine</h3>
                <p className="text-blue-100 text-sm mb-4">เครื่องมือสู่เสรีภาพ</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm">จาก "ไอเดีย" สู่ "รายได้"</p>
                  <p className="text-xs mt-1">ระบบสร้างธุรกิจออนไลน์</p>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ทำไมต้อง "The Freedom Engine"?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-blue-600">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ระบบการที่พิสูจน์แล้ว</h4>
                    <p className="text-gray-600">ไม่ใช่แค่ทฤษฎี แต่เป็นขั้นตอนที่ผู้เขียนใช้สร้างธุรกิจจริง</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-green-600">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">เครื่องมือที่ใช้งานได้จริง</h4>
                    <p className="text-gray-600">มาพร้อมแพลตฟอร์มออนไลน์ที่ช่วยคุณปฏิบัติตามหนังสือ</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-purple-600">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">จากศูนย์สู่รายได้แรก</h4>
                    <p className="text-gray-600">ไม่ว่าคุณจะเริ่มต้นจากจุดไหน สามารถทำตามได้</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-orange-800 mb-2">🎁 โบนัสเฉพาะผู้ซื้อหนังสือ:</h4>
                <ul className="text-orange-700 space-y-1 text-sm">
                  <li>✅ รหัสลับปลดล็อกเครื่องมือพิเศษบน begins.guide</li>
                  <li>✅ เข้าถึงชุมชนออนไลน์สำหรับผู้อ่าน</li>
                  <li>✅ อัปเดตเนื้อหาใหม่ฟรีตลอดชีวิต</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            สารบัญหนังสือ
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-blue-600 mb-4">📘 ส่วนที่ 1: Foundation</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">1</span>
                  Mindset ของผู้ประกอบการ
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">2</span>
                  หลักการ Value Ladder
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">3</span>
                  การหาไอเดียที่ขายได้
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-green-600 mb-4">📗 ส่วนที่ 2: Execution</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600 mr-3">4</span>
                  การสร้าง MVP ด้วยงบน้อย
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600 mr-3">5</span>
                  การทดสอบตลาดอย่างมีประสิทธิภาพ
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600 mr-3">6</span>
                  การสร้าง Sales Funnel แรก
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-purple-600 mb-4">📕 ส่วนที่ 3: Scale</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 mr-3">7</span>
                  การเพิ่มช่องทางขาย
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 mr-3">8</span>
                  ระบบอัตโนมัติที่สร้างรายได้
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 mr-3">9</span>
                  การสร้าง Passive Income
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-orange-600 mb-4">📙 ส่วนที่ 4: Freedom</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 mr-3">10</span>
                  การคำนวณ Freedom Number
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 mr-3">11</span>
                  แผนที่สู่เสรีภาพทางการเงิน
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 mr-3">12</span>
                  ชีวิตหลังบรรลุ Freedom
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            คำรับรองจากผู้อ่าน
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "หนังสือนี้เปลี่ยนชีวิตผม สร้างรายได้เสริมได้ 15,000 บาท/เดือนภายใน 3 เดือน"
              </p>
              <div className="text-sm text-gray-600">
                <strong>นาย ก.</strong> - ผู้ประกอบการหน้าใหม่
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "แพลตฟอร์มที่มาพร้อมหนังสือทำให้ปฏิบัติตามได้ง่าย ไม่ใช่แค่อ่านแล้วจบ"
              </p>
              <div className="text-sm text-gray-600">
                <strong>คุณ ข.</strong> - เจ้าของ E-commerce
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "ครั้งแรกที่อ่านหนังสือธุรกิจแล้วรู้สึกว่าทำได้จริง มีขั้นตอนชัดเจน"
              </p>
              <div className="text-sm text-gray-600">
                <strong>คุณ ค.</strong> - ลูกจ้างที่อยากเป็นเจ้าของธุรกิจ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            พร้อมเริ่มต้นการเดินทางสู่เสรีภาพแล้วหรือยัง?
          </h2>
          
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            หยุดแค่ฝัน เริ่มลงมือทำ พร้อมเครื่องมือที่จะพาคุณไปให้ถึงเป้าหมาย
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => handlePurchase('bundle')}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              🎁 Bundle Deal - ฿599 (ประหยัด ฿99!)
            </button>
            <button
              onClick={() => handlePurchase('ebook')}
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              📱 E-book - ฿299
            </button>
          </div>

          <div className="text-sm opacity-75">
            💰 รับประกันคืนเงิน 30 วัน หากไม่พอใจ | 
            🚀 ดาวน์โหลดทันทีหลังชำระเงิน
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      {showPurchaseModal && <PurchaseModal />}
    </div>
  );
};

export default BookPage;