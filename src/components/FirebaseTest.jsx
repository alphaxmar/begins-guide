import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [authStatus, setAuthStatus] = useState('not-authenticated');
  const [currentUser, setCurrentUser] = useState(null);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Test Firebase connection
    testFirebaseConnection();
    
    // Listen to auth state changes
    const unsubscribe = firebaseService.onAuthStateChange((user) => {
      if (user) {
        setAuthStatus('authenticated');
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        });
      } else {
        setAuthStatus('not-authenticated');
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Test if Firebase is properly initialized
      if (auth) {
        setConnectionStatus('connected');
        setTestResult('✅ Firebase initialized successfully!\n✅ Auth service is available');
      } else {
        setConnectionStatus('error');
        setTestResult('❌ Firebase auth not initialized');
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResult(`❌ Firebase connection error: ${error.message}`);
    }
  };

  const testEmailAuth = async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    try {
      setTestResult('🔄 Testing email authentication...');
      await firebaseService.signUp(testEmail, testPassword, { displayName: 'Test User' });
      setTestResult('✅ Email authentication test successful!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          await firebaseService.signIn(testEmail, testPassword);
          setTestResult('✅ Email sign-in test successful!');
        } catch (signInError) {
          setTestResult(`❌ Email auth test failed: ${signInError.message}`);
        }
      } else {
        setTestResult(`ℹ️ Email auth test result: ${error.message}`);
      }
    }
  };

  const testGoogleAuth = async () => {
    try {
      setTestResult('🔄 Testing Google authentication...');
      await firebaseService.signInWithPopup();
      setTestResult('✅ Google authentication available!');
    } catch (error) {
      setTestResult(`ℹ️ Google auth test: ${error.message}`);
    }
  };

  const signOut = async () => {
    try {
      await firebaseService.signOut();
      setTestResult('✅ Successfully signed out');
    } catch (error) {
      setTestResult(`❌ Sign out error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🔥 Firebase Connection Test
      </h2>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : connectionStatus === 'checking'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {connectionStatus === 'connected' && '✅'}
          {connectionStatus === 'checking' && '🔄'}
          {connectionStatus === 'error' && '❌'}
          {' '}
          {connectionStatus === 'connected' ? 'Connected' : 
           connectionStatus === 'checking' ? 'Checking...' : 'Error'}
        </div>
      </div>

      {/* Auth Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          authStatus === 'authenticated' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {authStatus === 'authenticated' ? '✅ Authenticated' : '🔐 Not Authenticated'}
        </div>
        
        {currentUser && (
          <div className="mt-3 text-sm text-gray-600">
            <div><strong>UID:</strong> {currentUser.uid}</div>
            <div><strong>Email:</strong> {currentUser.email}</div>
            <div><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</div>
            <div><strong>Email Verified:</strong> {currentUser.emailVerified ? '✅' : '❌'}</div>
          </div>
        )}
      </div>

      {/* Firebase Configuration */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Firebase Configuration</h3>
        <div className="text-sm text-gray-600">
          <div><strong>Project ID:</strong> begins-guide</div>
          <div><strong>Auth Domain:</strong> begins-guide.firebaseapp.com</div>
          <div><strong>Storage Bucket:</strong> begins-guide.firebasestorage.app</div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
          {testResult || 'No tests run yet'}
        </pre>
      </div>

      {/* Test Buttons */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={testFirebaseConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Test Connection
          </button>
          
          <button
            onClick={testEmailAuth}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📧 Test Email Auth
          </button>
          
          <button
            onClick={testGoogleAuth}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🔍 Test Google Auth
          </button>
          
          {currentUser && (
            <button
              onClick={signOut}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🚪 Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">การใช้งาน:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• คลิก "Test Connection" เพื่อตรวจสอบการเชื่อมต่อ Firebase</li>
          <li>• คลิก "Test Email Auth" เพื่อทดสอบการสมัครสมาชิก/เข้าสู่ระบบด้วยอีเมล</li>
          <li>• คลิก "Test Google Auth" เพื่อทดสอบการเข้าสู่ระบบด้วย Google</li>
          <li>• ตรวจสอบ Console ของเบราว์เซอร์สำหรับข้อมูลเพิ่มเติม</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;