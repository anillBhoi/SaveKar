"use client";

import { Bookmark } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-6">
        {/* SaveKar Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 shadow-lg flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            SaveKar
          </span>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-300">
            Loading your knowledge hub...
          </h2>
          {/* Loading spinner */}
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      {/* Subtle glow effects to match landing page */}
      <div className="pointer-events-none fixed inset-0 [mask-image:radial-gradient(300px_200px_at_50%_50%,black,transparent)]">
        <div className="absolute right-1/4 top-1/4 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute left-1/4 bottom-1/4 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>
    </div>
  );
}