
import React from 'react';

const SocialProofSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600">ได้รับความไว้วางใจจาก</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="bg-gray-200 h-12 w-32 rounded"></div>
          <div className="bg-gray-200 h-12 w-32 rounded"></div>
          <div className="bg-gray-200 h-12 w-32 rounded"></div>
          <div className="bg-gray-200 h-12 w-32 rounded"></div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
