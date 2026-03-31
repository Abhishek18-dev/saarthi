import { Code2, ArrowUpRight } from "lucide-react";

export const ActiveProjects = () => (
  <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white overflow-hidden relative group">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
          <Code2 size={20} className="text-indigo-400" />
        </div>
        <button className="text-indigo-400 hover:text-white transition-colors">
          <ArrowUpRight size={20} />
        </button>
      </div>
      <h4 className="text-lg font-bold leading-tight mb-1">
        Fintech Dashboard
      </h4>
      <p className="text-slate-400 text-xs mb-4">
        React + TypeScript expertise needed.
      </p>
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <img
            key={i}
            src={`https://i.pravatar.cc/100?img=${i + 10}`}
            className="w-6 h-6 rounded-full border-2 border-slate-900"
            alt=""
          />
        ))}
        <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold">
          +5
        </div>
      </div>
    </div>
  </div>
);
