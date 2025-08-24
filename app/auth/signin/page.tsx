"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chrome, Sparkles, User, Shield, Loader2, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description:
          "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue as guest.",
        variant: "destructive",
      });
      return;
    }

    setIsGuestLoading(true);
    try {
      const result = await signIn("credentials", {
        email: "guest@secondbrain.demo",
        name: guestName.trim(),
        isGuest: "true",
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Guest sign in failed",
          description:
            "There was an error signing in as guest. Please try again.",
          variant: "destructive",
        });
      } else if (result?.ok) {
        const session = await getSession();
        if (session) {
          router.push("/");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Guest sign in failed",
        description:
          "There was an error signing in as guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 shadow-lg flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            SaveKar
          </span>
        </div>

        <Card className="glass-effect border-slate-700 bg-slate-800/40 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4">
          
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome to SaveKar
              </CardTitle>
              <CardDescription className="text-slate-300 mt-2">
                Your second brain for links & notes
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">Welcome back</h3>
              <p className="text-sm text-slate-300">
                Sign in to access your curated collection of websites, videos, and
                insights
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleSignIn}
              disabled={isLoading || isGuestLoading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Chrome className="w-5 h-5" />
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800/40 px-2 text-slate-400">
                  Or try without account
                </span>
              </div>
            </div>

            {/* Guest Sign In */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Shield className="w-4 h-4" />
                <span>Demo mode - no personal data required</span>
              </div>

              <Input
                placeholder="Enter your name..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                maxLength={50}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleGuestSignIn();
                  }
                }}
              />

              <Button
                onClick={handleGuestSignIn}
                disabled={isLoading || isGuestLoading || !guestName.trim()}
                variant="outline"
                className="w-full h-12 border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 text-white font-medium rounded-xl transition-all duration-200"
              >
                {isGuestLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Continue as Guest</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-3 h-3" />
              <span>Secure authentication powered by NextAuth</span>
            </div>
          </CardContent>
        </Card>

        {/* Subtle glow effects */}
        <div className="pointer-events-none fixed inset-0 [mask-image:radial-gradient(300px_200px_at_center,black,transparent)]">
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-10 bottom-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>
      </div>

      <Toaster />
    </div>
  );
}