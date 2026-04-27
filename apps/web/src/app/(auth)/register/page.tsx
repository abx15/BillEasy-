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
  Building2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

const registerSchema = z
  .object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
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
      
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: data.businessName,
          ownerName: data.ownerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Successfully registered, now redirect to login
        router.push("/login?registered=true");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          {/* Logo Section */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-16 group">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group-hover:bg-white/30 transition-all">
                <span className="font-bold text-2xl">B</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">BillEasy</span>
            </Link>

            {/* Hero Content */}
            <div className="max-w-md space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Start your journey <br />
                <span className="text-white/80">with us today.</span>
              </h1>
              <div className="space-y-6 mt-8">
                {[
                  { text: 'Free 14-day premium trial', icon: ShieldCheck },
                  { text: 'No credit card required', icon: CheckCircle2 },
                  { text: 'Setup in less than 2 minutes', icon: ArrowRight },
                  { text: 'Dedicated 24/7 support', icon: CheckCircle2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-lg">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10">
            <p className="text-white/60 text-sm">
              © 2026 BillEasy Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-12">
          {/* Mobile Header */}
          <div className="mb-10 text-center lg:hidden">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">BillEasy</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {/* Desktop Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 text-lg">Join thousands of businesses already using BillEasy.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Business Name</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Acme Corp"
                    {...registerForm("businessName")}
                    error={errors.businessName?.message}
                    disabled={isLoading}
                    className="pl-12"
                  />
                  <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Owner Name</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...registerForm("ownerName")}
                      error={errors.ownerName?.message}
                      disabled={isLoading}
                      className="pl-12"
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      {...registerForm("phone")}
                      error={errors.phone?.message}
                      disabled={isLoading}
                      className="pl-12"
                    />
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...registerForm("email")}
                    error={errors.email?.message}
                    disabled={isLoading}
                    className="pl-12"
                  />
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Business Address</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="123, Main Street, City"
                    {...registerForm("address")}
                    error={errors.address?.message}
                    disabled={isLoading}
                    className="pl-12"
                  />
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars"
                      {...registerForm("password")}
                      error={errors.password?.message}
                      disabled={isLoading}
                      className="pl-12 pr-10"
                    />
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Confirm</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat"
                      {...registerForm("confirmPassword")}
                      error={errors.confirmPassword?.message}
                      disabled={isLoading}
                      className="pl-12 pr-10"
                    />
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <p className="text-xs text-gray-500 leading-relaxed text-center">
                  By clicking "Create Account", you agree to our{" "}
                  <Link href="/terms" className="text-blue-600 font-bold hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 font-bold hover:underline">
                    Privacy
                  </Link>.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-500">
              © 2026 BillEasy™. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
;
}
