import { UserPlus, Star } from "lucide-react";
import { motion } from "framer-motion";

export const SuggestedBuddies = () => {
  const suggestions = [
    { name: "Aryan Sharma", skill: "React Expert", match: "98%", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    { name: "Priya Das", skill: "Python/ML", match: "85%", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-[2.5rem] shadow-xl">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <Star size={16} className="text-yellow-500 fill-yellow-500" /> Top Match Suggestions
      </h3>
      <div className="space-y-4">
        {suggestions.map((buddy, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <img src={buddy.img} className="w-10 h-10 rounded-xl bg-indigo-50" alt="" />
              <div>
                <p className="text-sm font-bold text-slate-800">{buddy.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{buddy.skill}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{buddy.match}</span>
              <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                <UserPlus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};