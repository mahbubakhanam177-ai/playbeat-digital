"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  Check,
  AlertCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultMode = "signin",
}: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = React.useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError(null);
      setEmail("");
      setPassword("");
    }
  }, [open, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      setLoading(false);
      return;
    }

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === "signup") {
      toast({
        title: "Account created!",
        description: "Check your email for a confirmation link.",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You're now signed in.",
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="glass-strong w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "signin"
            ? "Sign in to your Playbeat Digital account."
            : "Create a new Playbeat Digital account."}
        </DialogDescription>

        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/[0.06] p-6">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/25">
                {mode === "signin" ? (
                  <LogIn className="size-5.5" />
                ) : (
                  <UserPlus className="size-5.5" />
                )}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {mode === "signin"
                    ? "Sign in to your Playbeat Digital account"
                    : "Join 320,000+ digital creators worldwide"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-muted-foreground"
              />
            </div>
            {mode === "signin" && (
              <button
                type="button"
                className="text-[11px] text-gold transition-colors hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold py-3 text-sm font-semibold text-black transition-all hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "signin" ? (
              <>
                <LogIn className="size-4" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="size-4" /> Create Account
              </>
            )}
          </Button>

          {/* Toggle mode */}
          <div className="text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="font-semibold text-gold transition-colors hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="font-semibold text-gold transition-colors hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
            <Check className="size-3 text-success" />
            Secure authentication via Supabase
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
