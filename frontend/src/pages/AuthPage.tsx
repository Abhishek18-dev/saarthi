import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router"; // 1. Import useNavigate
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: ["React", "TypeScript"],
    skillLevel: "INTERMEDIATE",
    goal: "PROJECT_PARTNER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await api.post(endpoint, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.name);

      console.log("🚀 CONNECTION SUCCESSFUL!");

      // OPTIONAL: If you want to skip the debug screen and redirect immediately:
      // navigate("/connect");

      setLoginData(response.data);
      setShowDebug(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.error("❌ BACKEND ERROR:", error.response?.data);
      alert(
        error.response?.data?.message ||
          "Check if Spring Boot & Ngrok are running!",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F1A] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />

      {/* --- DEBUG SUCCESS OVERLAY --- */}
      <AnimatePresence>
        {showDebug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0B0F1A]/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-green-500/30 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500/20 rounded-2xl">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    Handshake Verified
                  </h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Node Connected Successfully
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-3">
                    <Terminal size={14} /> Identity Token
                  </p>
                  <p className="text-blue-400 font-mono text-[10px] break-all line-clamp-3 italic">
                    {loginData?.token}
                  </p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-3">
                    <Database size={14} /> Profile Sync
                  </p>
                  <pre className="text-indigo-300 font-mono text-[10px]">
                    {JSON.stringify(
                      { id: loginData?.userId, name: loginData?.name },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                {/* 3. Updated Button Logic to use Navigate */}
                <button
                  onClick={() => navigate("/connect")}
                  className="flex-1 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                >
                  Configure Skills{" "}
                  <ArrowRight size={16} className="inline ml-2" />
                </button>
                <button
                  onClick={() => setShowDebug(false)}
                  className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl text-xs uppercase hover:text-white transition-all"
                >
                  Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... (rest of your Auth Form code remains the same) */}
      <motion.div className="relative z-10 w-full max-w-md p-8 mx-4 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl mb-4">
            <Sparkles className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            {isLogin ? "System Access" : "Create Node"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="password"
              placeholder="Secure Password"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
          >
            {isLoading
              ? "Authenticating..."
              : isLogin
                ? "Initialize Session"
                : "Deploy Profile"}
            {!isLoading && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Create new node" : "Existing node login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
