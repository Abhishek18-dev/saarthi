import React from "react";
import { Video, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const ScheduledMeetingCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mx-2 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-blue-100 dark:border-gray-700 relative overflow-hidden group"
    >
      {/* Background Decoration */}
      <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {/* Live indicator dot */}
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-400">
              Upcoming
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            14:00 PM
          </span>
        </div>

        <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-tight mb-1">
          UI/UX Sync Meeting
        </h4>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">
          With Design Team
        </p>

        <button className="w-full py-2 bg-white dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl shadow-sm border border-blue-100 dark:border-gray-600 transition-all flex items-center justify-center gap-2 group/btn">
          Join Now
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
