import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { motion } from 'motion/react';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    Meteor.loginWithPassword(username, password, (err) => {
      setLoading(false);
      if (err) {
        setError(err.reason || 'Login failed. Please check your credentials.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-[440px] w-full"
      >
        <h1 className="text-[2.5rem] font-bold text-[#1e293b] text-center mb-10 tracking-tight">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-[0.95rem] font-medium text-[#475569] mb-2 ml-1"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-[#e2e8f0] bg-white text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[0.95rem] font-medium text-[#475569] mb-2 ml-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-[#e2e8f0] bg-white text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#4b6bff] hover:bg-[#3b5beb] text-white font-bold text-lg rounded-2xl shadow-[0_10px_25px_rgba(75,107,255,0.3)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm font-medium">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-[#4b6bff] hover:text-[#3b5beb] font-bold transition-colors"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};
