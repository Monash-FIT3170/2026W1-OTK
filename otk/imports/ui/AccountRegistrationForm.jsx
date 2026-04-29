import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

export const AccountRegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const submit = e => {
    e.preventDefault();
    Meteor.call('auth.registerUser', { username, email, password }, (err, userId) => {
      if (err && err.error !== 403) {
        setError(err.reason)
      } else {
        Meteor.call('userData.registerUser', { userId });
        setError("")
      };
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
      </form>
    </div>
  )

}