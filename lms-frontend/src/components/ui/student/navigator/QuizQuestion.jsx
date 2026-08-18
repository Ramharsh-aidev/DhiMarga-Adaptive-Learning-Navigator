import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuizQuestion = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    if (!submitted) setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    
    const isCorrect = selected === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-4 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded font-medium ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty.toUpperCase()}
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 mb-6">{question.question}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          let styleClass = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
          if (selected === option) styleClass = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500";
          
          if (submitted) {
            if (option === question.correctAnswer) {
              styleClass = "border-green-500 bg-green-50 text-green-700";
            } else if (selected === option) {
              styleClass = "border-red-500 bg-red-50 text-red-700";
            } else {
              styleClass = "border-gray-200 opacity-50";
            }
          }

          return (
            <div 
              key={idx}
              onClick={() => handleSelect(option)}
              className={`p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${styleClass}`}
            >
              <span>{option}</span>
              {submitted && option === question.correctAnswer && <CheckCircle2 className="text-green-500" size={20} />}
              {submitted && selected === option && option !== question.correctAnswer && <XCircle className="text-red-500" size={20} />}
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={!selected || submitted}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-indigo-700 transition-colors"
      >
        {submitted ? 'Checking...' : 'Submit Answer'}
      </button>
    </div>
  );
};

export default QuizQuestion;
