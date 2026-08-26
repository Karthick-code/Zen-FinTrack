import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ShieldCheck,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Database,
} from "lucide-react";

export const AuthPage = () => {
  const { login, register, quickLoginAsDemoUser, quickLoginAsAdmin } =
    useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(name, email, password, confirmPassword);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#353531] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        {/* <div className="mx-auto w-14 h-14 rounded-2xl bg-[#434C3E] text-[#FDFBF7] flex items-center justify-center shadow-lg text-3xl font-serif font-bold">
          ₹
        </div> */}

        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#434C3E] text-[#FDFBF7] flex items-center justify-center shadow-lg text-3xl font-serif font-bold">
          <img
            src="https://res.cloudinary.com/dw94vpvkd/image/upload/v1787311376/Zen_FinTrack_lfyzcv.png"
            alt="Zen FinTrack"
            className="w-10 h-10 rounded-xl"
          />
        </div>
        {/*  */}
        <h2 className="mt-4 text-3xl font-serif font-bold tracking-tight text-[#353531]">
          Zen FinTrack
        </h2>
        <p className="mt-1 text-sm text-[#7A756D]">
          Simple tracking. Smarter saving.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#EBE7E0] shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-[#EBE7E0] mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-all ${
                isLogin
                  ? "border-[#434C3E] text-[#434C3E]"
                  : "border-transparent text-[#7A756D] hover:text-[#353531]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-all ${
                !isLogin
                  ? "border-[#434C3E] text-[#434C3E]"
                  : "border-transparent text-[#7A756D] hover:text-[#353531]"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#BC5F4F]/10 border border-[#BC5F4F]/30 text-[#BC5F4F] rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#7A756D] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karthick R"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-sm text-[#353531] focus:outline-none focus:border-[#434C3E]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#7A756D] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@zenfintrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-sm text-[#353531] focus:outline-none focus:border-[#434C3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7A756D] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-sm text-[#353531] focus:outline-none focus:border-[#434C3E]"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#7A756D] uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#EBE7E0] rounded-xl px-3.5 py-2.5 text-sm text-[#353531] focus:outline-none focus:border-[#434C3E]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#434C3E] hover:bg-[#363E32] text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Sign In to Zen FinTrack"
                    : "Register Account"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins
          <div className="mt-8 pt-6 border-t border-[#EBE7E0]">
            <p className="text-xs text-center font-semibold text-[#7A756D] uppercase tracking-wider mb-3">
              One-Click Demo Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 justify-items-center">
              <button
                type="button"
                onClick={quickLoginAsDemoUser}
                className="p-2.5 rounded-xl border border-[#EBE7E0] bg-[#FDFBF7] hover:bg-[#F7F4EE] text-left transition-all group flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#353531] group-hover:text-[#434C3E]">
                    Demo User
                  </p>
                  <p className="text-[11px] text-[#7A756D]">Karthick R</p>
                </div>
              </button>

              {/* <button
                type="button"
                onClick={quickLoginAsAdmin}
                className="p-2.5 rounded-xl border border-[#BC8A5F]/30 bg-[#BC8A5F]/10 hover:bg-[#BC8A5F]/20 text-left transition-all group flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#BC8A5F]/20 text-[#8C5D33] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#8C5D33]">
                    Master Admin
                  </p>
                  <p className="text-[11px] text-[#7A756D]">User Management</p>
                </div>
              </button> 
            </div>
          </div>
        </div> */}

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-[#EBE7E0]">
            <p className="text-xs text-center font-semibold text-[#7A756D] uppercase tracking-wider mb-3">
              One-Click Demo Access
            </p>

            <div className="flex justify-center">
              {/* Demo User */}
              <button
                type="button"
                onClick={quickLoginAsDemoUser}
                className="p-2.5 rounded-xl border border-[#EBE7E0] bg-[#FDFBF7] hover:bg-[#F7F4EE] text-left transition-all group flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#434C3E]/10 text-[#434C3E] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#353531] group-hover:text-[#434C3E]">
                    Demo User
                  </p>
                  <p className="text-[11px] text-[#7A756D]">Karthick R</p>
                </div>
              </button>

              {/* =====================================================
        ADMIN DEMO LOGIN - BACKUP CODE
        Uncomment when needed
        ===================================================== */}

              {/*
    <button
      type="button"
      onClick={quickLoginAsAdmin}
      className="p-2.5 rounded-xl border border-[#BC8A5F]/30 bg-[#BC8A5F]/10 hover:bg-[#BC8A5F]/20 text-left transition-all group flex items-center gap-2.5"
    >
      <div className="w-8 h-8 rounded-lg bg-[#BC8A5F]/20 text-[#8C5D33] flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>

      <div>
        <p className="text-xs font-bold text-[#8C5D33]">
          Master Admin
        </p>
        <p className="text-[11px] text-[#7A756D]">
          User Management
        </p>
      </div>
    </button>
    */}
            </div>
          </div>

          {/* Database notice */}
          <div className="mt-6 text-center text-xs text-[#7A756D] flex items-center justify-center gap-1.5">
            <span> © 2026 Zen FinTrack. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
