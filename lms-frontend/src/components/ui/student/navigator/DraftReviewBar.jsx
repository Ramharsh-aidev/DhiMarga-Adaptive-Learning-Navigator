import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigator } from '../../../../context/NavigatorContext';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const DraftReviewBar = () => {
  const { state, dispatch } = useNavigator();

  if (!state.draftEdits || state.draftEdits.length === 0) {
    return null;
  }

  const handleConfirm = () => {
    dispatch({ type: 'COMMIT_DRAFTS', payload: state.draftEdits });
  };

  const handleDiscard = () => {
    dispatch({ type: 'DISCARD_DRAFTS' });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200 p-4 flex items-center gap-6 min-w-[400px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Unsaved AI Changes</h4>
            <p className="text-xs font-medium text-slate-500">
              The AI proposes {state.draftEdits.length} change{state.draftEdits.length !== 1 ? 's' : ''} to your path.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleDiscard}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <XCircle size={16} /> Discard
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md shadow-amber-500/20 transition-all"
          >
            <CheckCircle2 size={16} /> Confirm Changes
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DraftReviewBar;
