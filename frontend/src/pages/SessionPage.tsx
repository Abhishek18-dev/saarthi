import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Users,
  MoreVertical,
  Search,
  ArrowRight,
  Zap,
} from "lucide-react";

// --- LAG-PROOF CSS BACKGROUND ---
const StaticBackground = () => (
  <div className="fixed inset-0 -z-10 bg-[#f8fafc] dark:bg-[#0a0a0a]">
    {/* High-performance CSS Mesh */}
    <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(circle_at_0%_0%,#4f46e5_0,transparent_25%),radial-gradient(circle_at_100%_0%,#3b82f6_0,transparent_25%),radial-gradient(circle_at_100%_100%,#2dd4bf_0,transparent_25%),radial-gradient(circle_at_0%_100%,#8b5cf6_0,transparent_25%)]" />
    {/* Subtlest possible grain to prevent color banding */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
  </div>
);

const UPCOMING_SESSIONS = [
  {
    id: 1,
    title: "Advanced React Patterns",
    mentor: "Aryan Sharma",
    time: "10:30 AM - 12:00 PM",
    date: "Today",
    status: "Live",
    students: 42,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    title: "UI Design Systems 101",
    mentor: "Sarah Chen",
    time: "02:00 PM - 03:30 PM",
    date: "Today",
    status: "Upcoming",
    students: 128,
    color: "from-violet-600 to-purple-600",
  },
  {
    id: 3,
    title: "Backend Scalability",
    mentor: "David Miller",
    time: "09:00 AM - 10:30 AM",
    date: "Tomorrow",
    status: "Upcoming",
    students: 85,
    color: "from-emerald-600 to-teal-600",
  },
];

export const SessionsPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const filteredSessions = UPCOMING_SESSIONS.filter((s) =>
    filter === "All" ? true : s.status === filter,
  );

  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-100">
      <StaticBackground />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              Real-time Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Learning <span className="text-blue-600">Sessions</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Find a session..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-shadow shadow-sm"
              />
            </div>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-md shadow-blue-200 dark:shadow-none">
              + Schedule
            </button>
          </div>
        </header>

        {/* FAST TABS */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
          {["All", "Live", "Upcoming"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === t
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* GRID SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 bg-gradient-to-br ${session.color} rounded-2xl text-white`}
                  >
                    <Video className="w-5 h-5" />
                  </div>
                  {session.status === "Live" && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black border border-red-100 dark:border-red-900/30">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {session.mentor}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {session.time.split(" ")[0]}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                      <Users className="w-3.5 h-3.5" /> {session.students}
                    </div>
                  </div>
                </div>

                <button
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    session.status === "Live"
                      ? "bg-slate-900 dark:bg-blue-600 text-white hover:opacity-90"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {session.status === "Live" ? "Join Now" : "Set Reminder"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* LIST VIEW */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Weekly Agenda
            </h2>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {UPCOMING_SESSIONS.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${s.color}`}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {s.date} • {s.time}
                    </p>
                  </div>
                </div>
                <CalendarIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
