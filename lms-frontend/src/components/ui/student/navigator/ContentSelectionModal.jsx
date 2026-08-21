import React from 'react';
import { Video, Globe, Check, ArrowRight } from 'lucide-react';

const ContentSelectionModal = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden flex flex-col md:flex-row">
        
        {/* Mentor Content Option */}
        <div 
          className="flex-1 p-8 hover:bg-indigo-50 transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-gray-100 group"
          onClick={() => onSelect('mentor')}
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Video size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Mentor Led</h3>
          <p className="text-gray-500 mb-6 min-h-[4rem]">
            Personalized, paid premium video content structured perfectly for your journey by expert mentors.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Highly curated and structured</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Direct alignment with platform assessments</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Premium support & community access</span>
            </li>
          </ul>
          <button className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
            Select Mentor Track <ArrowRight size={18} />
          </button>
        </div>

        {/* Open Source Content Option */}
        <div 
          className="flex-1 p-8 hover:bg-emerald-50 transition-colors cursor-pointer group"
          onClick={() => onSelect('opensource')}
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Globe size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Open Source</h3>
          <p className="text-gray-500 mb-6 min-h-[4rem]">
            High-quality, free content curated from top YouTube creators and open platforms (MIT, Google, HF).
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Completely free to access</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Best of YouTube: StatQuest, Karpathy, etc.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Learn from multiple world-class instructors</span>
            </li>
          </ul>
          <button className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
            Select Open Source Track <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContentSelectionModal;
