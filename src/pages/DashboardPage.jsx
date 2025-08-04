import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';
import Button from '../components/Button';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebaseService.onAuthStateChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        // Redirect to auth page if not authenticated
        window.location.hash = '#auth';
      }
    });

    return () => unsubscribe();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - this shouldn't show due to redirect, but just in case
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Button
            variant="primary"
            onClick={() => window.location.hash = '#auth'}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleStartValidation = () => {
    window.location.hash = '#idea-validator';
  };

  const handleLearnMore = () => {
    window.location.hash = '#book';
  };

  const handleSignOut = async () => {
    try {
      await firebaseService.signOut();
      window.location.hash = '#home';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="border border-gray-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user.displayName || user.email?.split('@')[0] || 'Friend'}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to build your path to financial freedom?
          </p>
        </div>

        {/* Freedom Number Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Freedom Number
            </h2>
            <p className="text-gray-600 mb-6">
              The monthly income you need to achieve true financial freedom (TMI - Target Monthly Income)
            </p>
            <div className="bg-gray-50 rounded-xl p-8 mb-6">
              <div className="text-6xl font-bold text-gray-400 mb-2">?</div>
              <p className="text-gray-500">
                Complete your idea validation to calculate your Freedom Number
              </p>
            </div>
            <p className="text-sm text-gray-500">
              This number represents the monthly passive income needed to cover your ideal lifestyle expenses.
            </p>
          </div>
        </div>

        {/* Primary Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Validate your business idea and discover your path to financial freedom.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartValidation}
              className="bg-white text-blue-600 hover:bg-gray-50 border-0 text-lg px-8 py-4 font-semibold shadow-lg"
            >
              🚀 Start Your Idea Validation
            </Button>
          </div>
        </div>

        {/* The Freedom Engine Book Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="md:flex">
            {/* Book Image Placeholder */}
            <div className="md:w-1/3 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-white/20 rounded-lg p-6 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">The Freedom Engine</h3>
                <p className="text-gray-300 mt-2">Your Blueprint to Success</p>
              </div>
            </div>

            {/* Book Content */}
            <div className="md:w-2/3 p-8">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Discover The Freedom Engine
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Learn the proven system that entrepreneurs use to build sustainable, 
                  profitable businesses that generate true financial freedom. This comprehensive 
                  guide will show you how to identify winning ideas, validate them effectively, 
                  and scale them into income-generating assets.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Step-by-step idea validation framework</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Financial freedom calculation methods</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Real-world case studies and examples</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleLearnMore}
                  className="w-full md:w-auto"
                >
                  📚 Learn More About The Book
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-600">Ideas Validated</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">$0</div>
            <div className="text-gray-600">Revenue Generated</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
            <div className="text-gray-600">Freedom Progress</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.hash = '#home'}
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-gray-700">Home</span>
            </button>
            <button
              onClick={() => window.location.hash = '#about'}
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">About</span>
            </button>
            <button
              onClick={() => window.location.hash = '#firebase-test'}
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Firebase Test</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-red-700">Sign Out</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;