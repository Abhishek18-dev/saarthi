import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  BookOpen,
  Target,
  ArrowLeft,
  Search,
  Sparkles,
  Zap,
  Cpu,
} from "lucide-react";

type AppState = "idle" | "matching" | "result";

// 1. INTERFACE EDIT: Aligned with Spring Boot DTO variables
interface Buddy {
  id: number;
  name: string;
  matchScore: number; // Mapping to your Backend's Double/Float score
  skills: string[]; // Mapping to your List<String> in PostgreSQL/MySQL
  goal: string;
  skillLevel: string;
}

export const SaarthiBuddyEngine: React.FC = () => {
  const [step, setStep] = useState<AppState>("idle");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [level, setLevel] = useState<string>("Mid");
  const [matches, setMatches] = useState<Buddy[]>([]);

  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "AI/ML",
    "Next.js",
    "Tailwind",
  ];

  // 2. LOGIC EDIT: Passing the UserID to trigger the FastAPI Engine
  const handleStartMatching = async () => {
    setStep("matching");

    try {
      // Pulling the ID of the current user logged into the node
      const userId = localStorage.getItem("userId");

      // Requesting Spring Boot to run the similarity math for this specific user
      const response = await api.get(`/api/matches/${userId}`);

      setMatches(response.data);
      setStep("result");
    } catch (error) {
      console.error("AI Engine Error:", error);
      setStep("idle");
      alert("The AI Engine is currently desynced. Check Spring Boot logs.");
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="w-full max-w-xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl"
          >
            <div className="space-y-2 mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> AI Matchmaker
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">
                Find Your <span className="text-blue-500">Niche.</span>
              </h1>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <BookOpen size={14} className="text-blue-500" /> 01.
                  Specialization
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                        selectedSkills.includes(s)
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-slate-800/50 border-slate-700 text-slate-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Target size={14} className="text-blue-500" /> 02. Proficiency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Mid", "Pro"].map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setLevel(lv)}
                      className={`py-3 rounded-2xl border font-black text-[10px] uppercase transition-all ${
                        level === lv
                          ? "bg-white text-black"
                          : "bg-slate-800/30 text-slate-500"
                      }`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartMatching}
              className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 shadow-xl"
            >
              <Search size={18} /> INITIATE MATCHMAKING
            </button>
          </motion.div>
        )}

        {step === "matching" && (
          <motion.div key="matching" className="flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 0.5, 0], scale: [0.5, 2, 2.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i }}
                  className="absolute inset-0 border border-blue-500/50 rounded-full"
                />
              ))}
              <div className="relative z-10 w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)]">
                <Cpu className="text-white w-10 h-10 animate-pulse" />
              </div>
            </div>
            <h2 className="mt-12 text-xl font-black text-white uppercase tracking-[0.4em] italic">
              Scanning...
            </h2>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl"
          >
            <button
              onClick={() => setStep("idle")}
              className="mb-8 flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> New Search
            </button>

            {matches.length === 0 ? (
              <div className="text-center p-10 bg-slate-900/40 rounded-[3rem] border border-white/5">
                <p className="text-slate-400 font-bold uppercase text-xs">
                  No Compatible Nodes Found in Network
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((buddy) => (
                  <div
                    key={buddy.id}
                    className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative group overflow-hidden"
                  >
                    {/* 3. PERCENTAGE EDIT: Calculating from Backend MatchScore */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <Zap
                        size={10}
                        className="text-green-400 fill-green-400"
                      />
                      <span className="text-green-400 text-[9px] font-black">
                        {Math.round(buddy.matchScore * 100)}% SYNC
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1 mb-4 shadow-xl">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.name}`}
                          className="w-full h-full rounded-xl bg-slate-900"
                          alt="avatar"
                        />
                      </div>

                      <h3 className="text-xl font-black text-white italic">
                        {buddy.name}
                      </h3>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1">
                        {buddy.skillLevel} • {buddy.goal}
                      </p>

                      {/* 4. SKILLS EDIT: Mapping through actual DB skills list */}
                      <div className="flex flex-wrap gap-1 mt-4 justify-center">
                        {buddy.skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 w-full mt-8">
                        <button className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                          Connect Node
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
