"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Bookmark, Loader2, ExternalLink, Folder, FileText } from "lucide-react";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState<"signup" | "login" | null>(null);

  const handleAuth = async (mode: "signup" | "login") => {
    setIsLoading(mode);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error(`${mode} error:`, err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Brand & Copy */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 shadow-lg flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              SaveKar
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Your second brain for{" "}
            <span className="text-indigo-400">links</span> &{" "}
            <span className="text-emerald-400">notes</span>.
          </h1>

          <p className="text-gray-300 max-w-md md:max-w-lg">
            Save what matters, organize with folders and tags, and find it
            instantly with fast search. Simple. Private. Always in your pocket.
          </p>

          {/* Value bullets */}
          <ul className="text-gray-300/90 space-y-2 max-w-md md:max-w-lg mx-auto md:mx-0">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
              Save website links in one click
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              Write quick notes alongside your links
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
              Organize with folders & smart tags
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
              Lightning-fast search when you need it
            </li>
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
            <button
              onClick={() => handleAuth("signup")}
              disabled={isLoading === "signup"}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {isLoading === "signup" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Get Started
            </button>

            <button
              onClick={() => handleAuth("login")}
              disabled={isLoading === "login"}
              className="px-6 py-3 rounded-lg border border-slate-600 text-gray-200 hover:bg-slate-800/60 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {isLoading === "login" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              I already have an account
            </button>
          </div>

          <p className="text-sm text-gray-400">
            Free forever · Privacy-first · Secure
          </p>
        </div>

        {/* Right: Three overlapping demo cards - Better positioning */}
        <div className="hidden md:flex items-center justify-center relative h-[420px]">
          {/* Bottom Card - YouTube Demo */}
          <div className="absolute right-4 bottom-0 w-64 h-72 rounded-2xl border border-slate-700 bg-slate-800/80 shadow-2xl overflow-hidden transform rotate-3 z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-red-600/10" />
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">YouTube</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              
              {/* Thumbnail placeholder */}
              <div className="flex-1 bg-gradient-to-br from-red-600/30 to-red-700/40 rounded-lg mb-3 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-slate-700/80 rounded-full"></div>
                <div className="h-3 w-3/4 bg-slate-700/60 rounded-full"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-3 w-16 bg-slate-700/50 rounded-full"></div>
                  <div className="h-6 w-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Card - Article Demo */}
          <div className="absolute right-12 top-16 w-68 h-76 rounded-2xl border border-slate-700 bg-slate-800/90 shadow-2xl overflow-hidden transform -rotate-2 z-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-blue-600/10" />
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-white">Article</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="flex-1 space-y-3 mb-3">
                <div className="h-5 bg-slate-700/80 rounded-full"></div>
                <div className="h-4 bg-slate-700/70 rounded-full"></div>
                <div className="h-4 w-5/6 bg-slate-700/60 rounded-full"></div>
                <div className="h-4 w-4/6 bg-slate-700/50 rounded-full"></div>
                <div className="h-4 w-3/4 bg-slate-700/40 rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <div className="h-6 w-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                  </div>
                  <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                  </div>
                </div>
                <div className="h-3 w-20 bg-slate-700/50 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Top Card - Note Demo */}
          <div className="absolute right-20 top-8 w-72 h-80 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden transform rotate-4 z-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-emerald-600/10" />
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">Quick Note</span>
                </div>
                <Folder className="w-4 h-4 text-emerald-400" />
              </div>
              
              <div className="flex-1 space-y-3 mb-4">
                <div className="h-6 bg-emerald-500/20 rounded-lg"></div>
                <div className="h-4 bg-emerald-500/15 rounded-full"></div>
                <div className="h-4 w-5/6 bg-emerald-500/15 rounded-full"></div>
                <div className="h-4 w-4/6 bg-emerald-500/10 rounded-full"></div>
                <div className="h-4 w-3/4 bg-emerald-500/10 rounded-full"></div>
                <div className="h-4 w-5/6 bg-emerald-500/10 rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 px-3 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-emerald-300">#ideas</span>
                  </div>
                  <div className="h-6 px-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-300">#research</span>
                  </div>
                </div>
                <div className="h-7 w-7 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow */}
      <div className="pointer-events-none fixed inset-0 [mask-image:radial-gradient(300px_200px_at_70%_20%,black,transparent)]">
        <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute left-10 bottom-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>
    </div>
  );
}