import React, { useState } from "react";
import { Search } from "lucide-react";
import { GreetingCard } from "./GreetingCard";
import { DetailedProgress } from "./Detailedprogess";
import { ActiveProjects } from "./ActiveProjects";
import { SuggestedBuddies } from "./SuggestedBuddies";

export const DashboardMain: React.FC = () => {
  const [search, setSearch] = useState("");

  // Get current date details
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-8">
      {/* 1. TOP HEADER: Name, Date, and Search */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 font-medium">{formattedDate}</p>
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search classes..."
            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 group-focus-within:text-blue-500" />
        </div>
      </header>

      {/* 2. GREETING CARD */}
      <GreetingCard />

      {/* 3. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Progress & Stats (Takes 2/3 of space) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 italic">
              Performance Analytics
            </h3>
            <DetailedProgress />
          </div>

          {/* Horizontal Row for small cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActiveProjects />
            <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white flex flex-col justify-between">
              <h4 className="text-xl font-black italic">
                Find a Peer
                <br />
                Study Session
              </h4>
              <button className="bg-white text-indigo-600 w-fit px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Explore Rooms
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Social & Matching (Takes 1/3 of space) */}
        <div className="space-y-8">
          <SuggestedBuddies />

          {/* Quick Activity Component */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 border-l-2 border-indigo-500 pl-4 py-1">
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">
                    Match accepted!
                  </span>{" "}
                  You are now connected with Aryan.
                </p>
              </div>
              <div className="flex gap-3 border-l-2 border-slate-200 pl-4 py-1">
                <p className="text-xs text-slate-600">
                  New project posted in{" "}
                  <span className="font-bold">React Community</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple reusable sub-component for Analytics
const AnalyticsCard = ({
  title,
  value,
  trend,
  isNegative,
}: {
  title: string;
  value: string;
  trend: string;
  isNegative?: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span
        className={`text-xs font-bold ${isNegative ? "text-red-500" : "text-green-500"}`}
      >
        {trend}
      </span>
    </div>
  </div>
);
