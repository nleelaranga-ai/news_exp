import React from 'react';
import { TimelineEvent } from '../types';
import { motion } from 'motion/react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 pb-6 border-l-2 border-gray-100 last:pb-0"
        >
          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <Clock size={12} />
            {event.timestamp}
            {event.impact === 'high' && (
              <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider ml-2">
                <AlertCircle size={10} />
                High Impact
              </span>
            )}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
