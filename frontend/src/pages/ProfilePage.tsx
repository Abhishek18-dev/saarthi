import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  User,
  Zap,
  ArrowUpRight,
  Bell,
  Settings,
  CheckCircle2,
  Clock,
  Flame,
  LayoutGrid,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  skills: { skillName: string; level: string }[];
  goal?: string;
  skillLevel?: string;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Handshake with Spring Boot
        const response = await api.get("/api/users/me");
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading)
    return (
      <div className="p-20 text-center font-black animate-pulse">
        SYNCING NODE...
      </div>
    );
  if (!userData)
    return (
      <div className="p-20 text-center text-red-500">NODE DISCONNECTED</div>
    );
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 text-gray-900 dark:text-white">
      {/* --- TOP ROW: BENTO HEADER --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3 relative overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl border border-white/20 dark:border-gray-800/50 rounded-[3rem] p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8"
        >
          {/* Animated Avatar Hub */}
          <div className="relative group">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 opacity-30 blur-2xl group-hover:opacity-60 transition-opacity"
            />
            <div className="relative w-32 h-32 rounded-[2.5rem] bg-gray-900 dark:bg-white p-1 overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-[2.3rem] bg-blue-600 flex items-center justify-center text-white">
                <User size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-black tracking-tighter">
                {userData.name}
              </h1>
              <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                {userData.skillLevel || "Pro"}
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              Full-stack Architect • UI Enthusiast
            </p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-xl text-xs font-bold shadow-sm"
                >
                  {skill.skillName}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="p-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              Edit Profile <Settings size={18} />
            </button>
            <button className="p-4 bg-blue-600/10 text-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
              Share Hub <ArrowUpRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-600 rounded-[3rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <Flame className="absolute -right-4 -top-4 w-32 h-32 opacity-20 rotate-12" />
          <p className="text-sm font-black uppercase tracking-widest opacity-80">
            Daily Streak
          </p>
          <div>
            <h2 className="text-6xl font-black italic tracking-tighter">24</h2>
            <p className="text-sm font-bold opacity-90">Days active in a row</p>
          </div>
          <div className="mt-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-xs font-bold text-center">
            Keep it up! 🔥
          </div>
        </motion.div>
      </div>

      {/* --- MIDDLE ROW: PROGRESS & REQUESTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Tracker (Bento Box) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-[3rem] p-8 shadow-xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  Project Progress
                </h3>
                <p className="text-gray-500 text-sm">
                  Your roadmap to the next level
                </p>
              </div>
              <LayoutGrid className="text-blue-600" />
            </div>

            <div className="space-y-8">
              {[
                { label: "Frontend Mastery", val: 88, color: "bg-blue-600" },
                { label: "Backend Scaling", val: 62, color: "bg-purple-500" },
                { label: "System Design", val: 45, color: "bg-cyan-400" },
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between mb-3 items-end">
                    <span className="text-sm font-black tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                      {item.val}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-2xl p-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={`h-full ${item.color} rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mini Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, val: "124h", label: "Learning" },
              { icon: CheckCircle2, val: "12", label: "Completed" },
              { icon: Zap, val: "98%", label: "Accuracy" },
              { icon: Bell, val: "5", label: "Updates" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/50 p-4 rounded-3xl text-center shadow-md"
              >
                <stat.icon className="mx-auto mb-2 text-blue-600" size={20} />
                <p className="text-lg font-black">{stat.val}</p>
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Panel */}
        <motion.div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-[3rem] p-8 shadow-xl flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-black tracking-tight">Requests</h3>
            <p className="text-gray-500 text-sm">People wanting to team up</p>
          </div>

          <div className="space-y-4 flex-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-gray-800/40 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black italic">
                      Collaborator #{i}04
                    </p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase">
                      React Niche
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl">
                    Accept
                  </button>
                  <button className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase rounded-xl">
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400 text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition-all">
            View All History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
