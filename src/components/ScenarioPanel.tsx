import React from 'react';
import { Scenario } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface ScenarioPanelProps {
  scenarios: Scenario[];
}

export const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ scenarios }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scenarios.map((scenario, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${
              scenario.type === 'likely' ? 'bg-blue-50 text-blue-600' :
              scenario.type === 'risk' ? 'bg-red-50 text-red-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              {scenario.type === 'likely' && <TrendingUp size={20} />}
              {scenario.type === 'risk' && <AlertTriangle size={20} />}
              {scenario.type === 'opportunity' && <Lightbulb size={20} />}
            </div>
            <div className="text-xs font-mono font-bold text-gray-400">
              {Math.round(scenario.probability * 100)}% PROB
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">{scenario.title}</h4>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{scenario.description}</p>
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Triggers</div>
            <div className="flex flex-wrap gap-2">
              {scenario.triggers.map((trigger, tIndex) => (
                <span key={tIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded font-medium">
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
