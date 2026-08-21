import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const QuizQuestion = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    if (!submitted) setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    const isCorrect = selected === question.correctAnswer;
    onAnswer(isCorrect, selected);
  };

  const isCorrectAnswer = selected === question.correctAnswer;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded font-medium ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty?.toUpperCase() || 'MEDIUM'}
          </span>
          <span className="text-xs px-2 py-1 rounded font-medium bg-gray-100 text-gray-600">
            {question.type === 'true_false' ? 'True / False' : 
             question.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
          </span>
        </div>
      </div>
      
      {question.type === 'scenario' && question.scenario && (
        <div className="mb-4 p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg text-slate-700 text-sm italic">
          {question.scenario}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-800 mb-6">{question.question}</h3>
      
      <div className={`space-y-3 mb-6 ${question.type === 'true_false' ? 'flex flex-row gap-4 space-y-0' : ''}`}>
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
              className={`p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${question.type === 'true_false' ? 'flex-1 justify-center font-medium' : ''} ${styleClass}`}
            >
              <span>{option}</span>
              {question.type !== 'true_false' && submitted && option === question.correctAnswer && <CheckCircle2 className="text-green-500" size={20} />}
              {question.type !== 'true_false' && submitted && selected === option && option !== question.correctAnswer && <XCircle className="text-red-500" size={20} />}
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-4 rounded-lg flex gap-3 ${isCorrectAnswer ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}
          >
            <div className="shrink-0 mt-0.5">
              {isCorrectAnswer ? <CheckCircle2 className="text-green-600" size={20} /> : <XCircle className="text-red-600" size={20} />}
            </div>
            <div>
              <p className="font-semibold mb-1">{isCorrectAnswer ? 'Correct!' : 'Incorrect'}</p>
              {question.explanation && <p className="text-sm opacity-90">{question.explanation}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted ? (
        <button 
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Submit Answer
        </button>
      ) : (
        <button 
          onClick={handleNext}
          className="w-full py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
        >
          Next Question
        </button>
      )}
    </div>
  );
};

export default QuizQuestion;
