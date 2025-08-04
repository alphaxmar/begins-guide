import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Project</h2>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Technology Stack
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li><strong>React 18:</strong> Modern React with hooks and concurrent features</li>
                <li><strong>Vite:</strong> Next generation frontend tooling for fast development</li>
                <li><strong>Tailwind CSS:</strong> Utility-first CSS framework for rapid styling</li>
                <li><strong>ESLint:</strong> Code linting for consistent code quality</li>
              </ul>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Project Structure
              </h3>
              <div className="bg-gray-100 p-4 rounded-md text-sm font-mono mb-6">
                <div>src/</div>
                <div>├── components/    # Reusable UI components</div>
                <div>├── pages/        # Page components</div>
                <div>├── services/     # API calls and business logic</div>
                <div>└── assets/       # Static assets</div>
              </div>
              
              <p className="text-gray-600">
                This project is set up with a clean, scalable architecture that makes it easy to 
                build modern web applications. The folder structure separates concerns and makes 
                it easy to find and maintain code as your project grows.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;