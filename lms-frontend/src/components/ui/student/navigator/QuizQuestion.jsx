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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded font-bold ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            {question.difficulty?.toUpperCase() || 'MEDIUM'}
          </span>
          <span className="text-xs px-2 py-1 rounded font-bold bg-slate-100 text-slate-600">
            {question.type === 'true_false' ? 'True / False' : 
             question.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
          </span>
        </div>
      </div>
      
      {question.type === 'scenario' && question.scenario && (
        <div className="mb-4 p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-xl text-slate-700 text-sm italic font-medium">
          {question.scenario}
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-900 mb-6">{question.question}</h3>
      
      <div className={`space-y-3 mb-6 ${question.type === 'true_false' ? 'flex flex-row gap-4 space-y-0' : ''}`}>
        {question.options.map((option, idx) => {
          let styleClass = "border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700";
          if (selected === option) styleClass = "border-violet-500 bg-violet-50 ring-1 ring-violet-500 text-violet-800 font-bold";
          
          if (submitted) {
            if (option === question.correctAnswer) {
              styleClass = "border-green-500 bg-green-50 text-green-800 font-bold";
            } else if (selected === option) {
              styleClass = "border-rose-500 bg-rose-50 text-rose-800 font-bold";
            } else {
              styleClass = "border-slate-200 opacity-50";
            }
          }

          return (
            <div 
              key={idx}
              onClick={() => handleSelect(option)}
              className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${question.type === 'true_false' ? 'flex-1 justify-center font-bold' : 'font-medium'} ${styleClass}`}
            >
              <span>{option}</span>
              {question.type !== 'true_false' && submitted && option === question.correctAnswer && <CheckCircle2 className="text-green-500" size={20} />}
              {question.type !== 'true_false' && submitted && selected === option && option !== question.correctAnswer && <XCircle className="text-rose-500" size={20} />}
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-4 rounded-xl flex gap-3 ${isCorrectAnswer ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}
          >
            <div className="shrink-0 mt-0.5">
              {isCorrectAnswer ? <CheckCircle2 className="text-green-600" size={20} /> : <XCircle className="text-rose-600" size={20} />}
            </div>
            <div>
              <p className="font-bold mb-1">{isCorrectAnswer ? 'Correct!' : 'Incorrect'}</p>
              {question.explanation && <p className="text-sm font-medium opacity-90">{question.explanation}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted ? (
        <button 
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all disabled:opacity-50"
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
