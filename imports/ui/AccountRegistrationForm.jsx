import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

export const AccountRegistrationForm = ({ onShowLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = e => {
    e.preventDefault();
    setError("");

    Meteor.call('auth.registerUser', { username, email, password }, (err, userId) => {
      if (err) {
        setError(err.reason || 'Registration failed.');
        return;
      }
      // Auto-login after successful registration, then create game data
      Meteor.loginWithPassword(username, password, (loginErr) => {
        if (loginErr) {
          setError('Account created! Please log in.');
          return;
        }
        Meteor.call('userData.registerUser', { userId }, (dataErr) => {
          if (dataErr) console.error('Failed to initialise game data:', dataErr);
        });
      });
    });
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4"
        >
        <h2 className="text-xl font-bold text-slate-800 text-center">Register Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
          <input
            id="username"
            type="text"
            required
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            required
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <input
            id="password"
            type="password"
            required
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
        {onShowLogin && (
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={(e) => { e.preventDefault(); onShowLogin(); }}
            >
              Sign In
            </a>
          </p>
        )}
      </form>
    </div>
  );
};
