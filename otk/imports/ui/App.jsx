import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { LoginForm } from './auth/LoginForm';
import { AccountRegistrationForm } from './AccountRegistrationForm';

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const user = useTracker(() => Meteor.user());

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        {showRegister ? <AccountRegistrationForm /> : <LoginForm />}

        <button
          onClick={() => setShowRegister(!showRegister)}
          className="mt-6 text-slate-600 underline hover:text-slate-900"
        >
          {showRegister
            ? 'Already have an account? Login'
            : 'Need an account? Register'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Welcome back, {user.username}!
        </h1>

        <p className="text-slate-600 mb-8">
          You are successfully logged in.
        </p>

        <button
          onClick={() => Meteor.logout()}
          className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};