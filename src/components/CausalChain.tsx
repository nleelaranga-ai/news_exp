import React from 'react';
import { CausalLink } from '../types';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CausalChainProps {
  links: CausalLink[];
}

export const CausalChain: React.FC<CausalChainProps> = ({ links }) => {
  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="flex-1">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Cause</div>
            <div className="text-sm font-medium text-gray-900">{link.cause}</div>
          </div>
          <div className="mt-6 text-gray-300">
            <ArrowRight size={20} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Effect</div>
            <div className="text-sm font-medium text-gray-900">{link.effect}</div>
          </div>
          <div className="flex-[1.5] border-l border-gray-200 pl-4 ml-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mechanism</div>
            <div className="text-xs text-gray-600 italic">{link.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
