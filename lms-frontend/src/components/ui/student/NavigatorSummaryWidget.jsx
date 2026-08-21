import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import MiniMindMap from './navigator/MiniMindMap';
import { Compass, ArrowRight, Target, AlertCircle, BookOpen } from 'lucide-react';

const NavigatorSummaryWidget = () => {
  const { state } = useNavigator();
  const navigate = useNavigate();

  // Guard if no goal is set
  if (!state.goal) return null;

  const stats = useMemo(() => {
    const { currentPath, learnerState } = state;
    
    let completedSkills = 0;
    let weakSkills = [];
    let nextSkill = null;

    currentPath.forEach(node => {
      const lState = learnerState[node.skillId];
      if (lState?.status === 'verified') {
        completedSkills++;
      } else if (lState?.status === 'gap') {
        weakSkills.push(node);
      }
      
      if (node.status === 'current' && !nextSkill) {
        nextSkill = node;
      }
    });

    const totalSkills = currentPath.length;
    const progressPercentage = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100);

    return {
      completedSkills,
      totalSkills,
      progressPercentage,
      weakSkills,
      nextSkill
    };
  }, [state.currentPath, state.learnerState]);

  const { progressPercentage, completedSkills, totalSkills, weakSkills, nextSkill } = stats;

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Progress Ring & Main Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            {/* SVG Progress Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-gray-100"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-indigo-600 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 2.827} 282.7`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
                <Compass size={20} />
                <span>AI Navigator</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {state.goal.targetRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>
              <p className="text-gray-500 mb-4">
                {completedSkills} of {totalSkills} skills mastered
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(state.pathStatus === 'planning' ? '/student/navigator/plan' : '/student/navigator/dashboard')}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  {state.pathStatus === 'planning' ? 'View Plan' : 'Continue Journey'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-32 bg-gray-200"></div>

          {/* Dynamic Content */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col justify-center">
              {nextSkill ? (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                    <Target size={16} />
                    <h4>Up Next</h4>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{nextSkill.label}</p>
                  <p className="text-xs text-blue-600 mt-1">Ready to learn</p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                    <Target size={16} />
                    <h4>Goal Reached</h4>
                  </div>
                  <p className="text-sm text-green-700 mt-1">You have mastered this path!</p>
                </div>
              )}

              {weakSkills.length > 0 && (
                <div className="mt-3 flex items-start gap-2 text-orange-600 bg-orange-50 p-2.5 rounded-lg border border-orange-100">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">
                    Review needed: {weakSkills.slice(0,2).map(s => s.label).join(', ')}
                    {weakSkills.length > 2 ? ` +${weakSkills.length - 2} more` : ''}
                  </p>
                </div>
              )}
            </div>

            <div className="h-full">
              <MiniMindMap onExpand={() => navigate('/student/navigator/plan')} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigatorSummaryWidget;
