import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScheduledMeetingCard } from "./ScheduledMeetingCard";
import { useNavigate, useLocation } from "react-router";
import { LogOut, ShieldCheck } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "" },
  { title: "Connect", icon: BookOpen, id: "connect" },
  { title: "Sessions", icon: Calendar, id: "sessions" },
  { title: "Profile", icon: User, id: "me" },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const userName = localStorage.getItem("userName") || "User Node";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Expanded if: (NOT manually collapsed) OR (Hovering to peek)
  const isExpanded = !isCollapsed || isHovered;

  const activeTab =
    location.pathname === "/" ? "" : location.pathname.split("/")[1];

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isExpanded ? 260 : 88,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        relative flex flex-col 
        h-[90vh] my-auto ml-4           /* Floating: Not full height, centered vertically */
        bg-white/70 dark:bg-gray-900/60 /* Glass effect */
        backdrop-blur-xl border border-white/20 dark:border-gray-800/50 
        rounded-[2.5rem] shadow-2xl z-50 overflow-visible
      "
    >
      {/* Precision Toggle Button - Sits on the border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-[60] flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform"
      >
        {isCollapsed && !isHovered ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Branding Section */}
      <div className="flex items-center gap-4 px-6 mt-10 mb-12 h-10 overflow-hidden">
        <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-xl italic tracking-tighter">
            S
          </span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-black tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
            >
              SAAR<span className="text-blue-600">THI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={() => navigate(`/${item.id}`)}
              className={`
                relative w-full flex items-center h-12 rounded-2xl transition-all group
                ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}
              `}
            >
              {/* Active/Hover Background Pill */}
              <AnimatePresence>
                {(hoveredTab === item.id || isActive) && (
                  <motion.span
                    layoutId="sidebar-pill"
                    className={`absolute inset-0 z-0 rounded-2xl ${
                      isActive
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "bg-gray-100/50 dark:bg-gray-800/30"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-center px-4 w-full">
                {/* Fixed width container for icon keeps it centered when shrinking */}
                <div className="min-w-[24px] flex justify-center">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-4 text-sm font-bold whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && isExpanded && (
                  <motion.div
                    layoutId="active-dot"
                    className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"
                  />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded-footer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ScheduledMeetingCard />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-2 text-gray-400"
            >
              <Calendar
                size={22}
                className="cursor-pointer hover:text-blue-600 transition-colors"
              />
              <Settings
                size={22}
                className="cursor-pointer hover:text-blue-600 transition-colors hover:rotate-90 duration-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
