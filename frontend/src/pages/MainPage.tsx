import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Zap,
  Target,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Fingerprint,
  Activity,
  Code2,
  Cpu,
} from "lucide-react";

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030508] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* --- HYPER-VISUAL BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      {/* --- FLOATING NAV ISLAND --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[50%] max-w-7xl z-50 px-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-between items-center shadow-2xl transition-all">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white italic uppercase">
            SAAR<span className="text-cyan-400">THI</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Neural Logic
          </a>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-white text-black rounded-full hover:bg-cyan-400 hover:text-white transition-all transform active:scale-95"
          >
            Initialize Node
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* --- SLIDE-IN MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[70%] z-[60] bg-[#05070A] border-l border-white/10 p-10 flex flex-col gap-10 md:hidden"
            >
              <div className="flex flex-col gap-8 text-2xl font-black italic uppercase tracking-tighter pt-20">
                <a
                  href="#features"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white"
                >
                  The Engine
                </a>
                <a
                  href="#vision"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-500"
                >
                  Vision
                </a>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-cyan-500 text-black rounded-2xl font-black"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION: SPLIT LAYOUT --- */}
      <section className="relative pt-44 lg:pt-52 pb-20 px-6 z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <Activity size={14} className="animate-pulse" /> 4,209 Nodes
              Online
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white italic leading-[0.85]">
              STOP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SOLOING.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              SaarThi is the AI matchmaker for the technical world. We pair
              students and pros with the
              <span className="text-white">
                {" "}
                same stack, level, and timeline{" "}
              </span>{" "}
              to build the future.
            </p>

            <div className="relative group w-fit">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <button
                onClick={() => navigate("/login")}
                className="relative px-10 py-5 bg-black rounded-2xl flex items-center gap-4 text-white font-black text-sm uppercase tracking-widest border border-white/10"
              >
                Find Your Tribe{" "}
                <ArrowRight size={20} className="text-cyan-400" />
              </button>
            </div>
          </motion.div>

          {/* Right Visual: The requested Eye-Catcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glow Behind Image */}
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />

              {/* Floating Illustration */}
              <img
                src="./public/Webinar-bro.svg"
                alt="AI Matchmaking Illustration"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(34,211,238,0.3)] animate-[float_4s_ease-in-out_infinite]"
              />

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-0 p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20"
              >
                <Cpu size={32} className="text-cyan-400" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 left-0 p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20"
              >
                <Fingerprint size={32} className="text-blue-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- BENTO GRID SECTION --- */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6 group hover:bg-slate-900/60 transition-colors">
            <Sparkles className="text-cyan-400" size={32} />
            <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">
              AI Skill Engine
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our FastAPI logic understands that "React Developer" and "Frontend
              Engineer" are the same DNA. No more lonely learning.
            </p>
          </div>

          <div className="bg-cyan-500 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl shadow-cyan-500/20 group">
            <Target
              size={40}
              className="text-black group-hover:rotate-12 transition-transform"
            />
            <div>
              <h4 className="text-2xl font-black italic text-black leading-none uppercase">
                Goal Sync
              </h4>
              <p className="text-black/70 text-[10px] font-black uppercase tracking-widest mt-2">
                Build • Learn • Practice
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
            <Code2 className="text-blue-500" size={32} />
            <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">
              Match 80% Tech
            </h4>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex justify-between items-center opacity-50">
        <span className="text-[10px] font-black uppercase tracking-[0.8em]">
          SkillSync 2026
        </span>
        <div className="flex gap-4">
          <MessageSquare size={18} />
          <Target size={18} />
        </div>
      </footer>

      {/* Add Floating CSS to your Global CSS or Style Tag */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};
