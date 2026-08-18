import React from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigator } from '../../../context/NavigatorContext';
import { getUpstreamNodes, getDownstreamNodes } from '../../../engine/graphEngine';

const NavigatorMap = () => {
  const { state } = useNavigator();

  if (!state.capabilityGraph) return <Navigate to="/student/navigator" />;

  const nodes = Object.values(state.capabilityGraph.nodes);
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Capability Map</h1>
      <p className="text-gray-600 mb-8">Visualization of dependencies for {state.capabilityGraph.name}</p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 min-h-[600px] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map(node => {
            const learnerSkill = state.learnerState[node.id];
            const isVerified = learnerSkill?.status === 'verified';
            const isGap = learnerSkill?.status === 'gap';
            
            return (
              <div 
                key={node.id} 
                className={`p-4 rounded-xl border ${isVerified ? 'bg-green-50 border-green-200' : isGap ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} shadow-sm`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{node.label}</h3>
                  {isVerified && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                  {isGap && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                </div>
                <p className="text-xs text-gray-500 mb-3">{node.category}</p>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Reqs: {node.prerequisites.length > 0 ? node.prerequisites.length : 'None'}</p>
                  <p>Unlocks: {node.unlocks.length}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigatorMap;
