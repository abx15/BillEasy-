"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Registering with:", data);
      localStorage.setItem("auth_token", "mock-token");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-gradient relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-dot-pattern" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30">
              <span className="font-bold text-2xl">B</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">BillEasy</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-5xl font-extrabold mb-8 leading-tight">
              Start your journey <br />
              <span className="text-white/70">with us today.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Free 14-day premium trial",
                "No credit card required",
                "Setup in less than 2 minutes",
                "Dedicated 24/7 support",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <p className="text-lg font-medium text-white/90">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            © 2026 BillEasy Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg py-12"
        >
          <div className="mb-10 lg:hidden text-center">
            <h1 className="text-3xl font-extrabold text-primary-600 mb-2">
              BillEasy
            </h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-foreground mb-3">
              Create Account
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of businesses already using BillEasy.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...registerForm("name")}
                    className="w-full bg-white border border-border rounded-input pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500 transition-all shadow-inner-soft"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    {...registerForm("phone")}
                    className="w-full bg-white border border-border rounded-input pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500 transition-all shadow-inner-soft"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...registerForm("email")}
                  className="w-full bg-white border border-border rounded-input pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500 transition-all shadow-inner-soft"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...registerForm("password")}
                  className="w-full bg-white border border-border rounded-input pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500 transition-all shadow-inner-soft"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  {...registerForm("confirmPassword")}
                  className="w-full bg-white border border-border rounded-input pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500 transition-all shadow-inner-soft"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="py-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By clicking "Create Account", you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-primary-600 font-bold hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary-600 font-bold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              className="py-4 shadow-brand"
              isLoading={isLoading}
            >
              Create Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <footer className="mt-10 text-center lg:text-left pt-8 border-t border-border/50">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 font-bold hover:underline underline-offset-4 decoration-2"
              >
                Sign in here
              </Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
