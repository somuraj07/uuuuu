"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MAIN_COLOR, ACCENT_COLOR, GRADIENT_PRIMARY, GRADIENT_LAVENDER } from "@/constants/colors";

type Role = "SUPERADMIN";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("SUPERADMIN");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    router.push("/admin/login");
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen px-4 py-8"
      style={{ background: GRADIENT_PRIMARY }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2" style={{ color: MAIN_COLOR }}>
              Create Account
            </h2>
            <p className="text-gray-600">
              Sign up to get started
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border glass focus:outline-none focus:ring-2 transition"
                style={{ borderColor: ACCENT_COLOR }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border glass focus:outline-none focus:ring-2 transition"
                style={{ borderColor: ACCENT_COLOR }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border glass focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: ACCENT_COLOR }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium"
                  style={{ color: MAIN_COLOR }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-4 py-3 rounded-xl border glass focus:outline-none focus:ring-2 transition"
                style={{ borderColor: ACCENT_COLOR }}
              >
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: GRADIENT_LAVENDER }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/admin/login"
                className="font-semibold hover:underline"
                style={{ color: MAIN_COLOR }}
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
