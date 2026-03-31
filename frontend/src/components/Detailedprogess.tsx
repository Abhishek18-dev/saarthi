import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Users, BookOpen } from "lucide-react";

export const DetailedProgress: React.FC = () => {
  const milestones = [
    { id: 1, title: "Curriculum Design", status: "completed", time: "Mar 12" },
    {
      id: 2,
      title: "Interactive Quiz Setup",
      status: "completed",
      time: "Mar 20",
    },
    {
      id: 3,
      title: "Live Session - Module 1",
      status: "current",
      time: "In Progress",
    },
    { id: 4, title: "Final Certification", status: "upcoming", time: "Apr 05" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* 1. DETAILED MILESTONE STEPPER (The "Process") */}
      <div className="lg:col-span-1 bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-blue-50/50 shadow-sm">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
          Course Roadmap
        </h3>
        <div className="space-y-8 relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700" />

          {milestones.map((step, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              key={step.id}
              className="flex items-start gap-4 relative z-10"
            >
              {step.status === "completed" ? (
                <div className="bg-blue-500 rounded-full p-0.5 shadow-lg shadow-blue-200">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              ) : step.status === "current" ? (
                <div className="bg-white border-2 border-blue-400 rounded-full p-0.5 animate-pulse">
                  <div className="w-4 h-4 bg-blue-400 rounded-full" />
                </div>
              ) : (
                <div className="bg-white border-2 border-gray-200 rounded-full p-0.5">
                  <Circle className="w-4 h-4 text-gray-200" />
                </div>
              )}

              <div>
                <p
                  className={`text-sm font-bold ${step.status === "upcoming" ? "text-gray-400" : "text-gray-800"}`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  {step.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY BREAKDOWN (Progress in Detail) */}
      <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-blue-50/50 shadow-sm">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
              Performance Details
            </h3>
            <p className="text-2xl font-black text-gray-800">
              Advanced UI Batch
            </p>
          </div>
          <div className="flex gap-4">
            <StatMini
              icon={Users}
              label="Students"
              value="84"
              color="text-blue-400"
            />
            <StatMini
              icon={Clock}
              label="Hours"
              value="12.5"
              color="text-sky-400"
            />
          </div>
        </div>

        {/* Segmented Progress Bars */}
        <div className="space-y-6">
          <DetailBar
            label="Content Completion"
            percentage={85}
            color="bg-blue-400"
          />
          <DetailBar
            label="Student Satisfaction"
            percentage={92}
            color="bg-sky-300"
          />
          <DetailBar
            label="Assignment Returns"
            percentage={64}
            color="bg-indigo-300"
          />
        </div>

        {/* Micro Summary Card */}
        <div className="mt-8 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">
              Current Focus
            </p>
            <p className="text-sm text-gray-600 font-medium">
              Auto-Layout & Constraints Mastery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for cleaner code
const StatMini = ({ icon: Icon, label, value, color }: any) => (
  <div className="text-right">
    <div className="flex items-center justify-end gap-1 mb-1">
      <Icon className={`w-3 h-3 ${color}`} />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
        {label}
      </span>
    </div>
    <p className="text-lg font-black text-gray-800 leading-none">{value}</p>
  </div>
);

const DetailBar = ({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) => (
  <div className="w-full">
    <div className="flex justify-between mb-2">
      <span className="text-xs font-bold text-gray-600">{label}</span>
      <span className="text-xs font-black text-gray-800">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);
