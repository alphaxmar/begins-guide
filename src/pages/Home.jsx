import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your React App
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Built with Vite and styled with Tailwind CSS
          </p>
          <div className="space-x-4">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fast Development</h3>
            <p className="text-gray-600">
              Lightning fast HMR and build times with Vite
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Modern Styling</h3>
            <p className="text-gray-600">
              Utility-first CSS framework for rapid UI development
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Organized Structure</h3>
            <p className="text-gray-600">
              Clean folder structure for scalable applications
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;