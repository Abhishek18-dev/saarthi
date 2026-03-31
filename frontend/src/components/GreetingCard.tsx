import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const GreetingCard = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 md:p-10 mb-8 text-white shadow-2xl">
      {/* --- GRAPHIC ELEMENT: Animated Mesh Background --- */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
      />
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side: Content */}
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3 h-3" />
            Daily Summary
          </motion.div>

          <h2 className="text-4xl font-extrabold mb-3 tracking-tight">
            Good Morning, <span className="text-blue-200">Aditya!</span> 👋
          </h2>

          <p className="text-blue-100 text-lg max-w-sm leading-relaxed mb-6">
            You have{" "}
            <span className="font-bold text-white underline decoration-blue-400">
              3 classes
            </span>{" "}
            scheduled for today. Your first session starts in 45 minutes.
          </p>

          <button className="group flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95">
            View Schedule
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side: Floating Avatar/Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative"
        >
          {/* Decorative Ring */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />

          <div className="relative w-48 h-48 md:w-56 md:h-56">
            {/* Replace this URL with your actual 3D avatar/Illustration */}
            <img
              src="https://illustrations.popsy.co/white/studying.svg"
              alt="Avatar"
              className="w-full h-full object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
            />
          </div>
        </motion.div>
      </div>

      {/* Tailwind custom animation defined in global CSS or inline styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
};
