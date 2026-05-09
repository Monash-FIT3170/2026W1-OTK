import React, { useState } from 'react';
import { EnemyList } from './components';
import { EnemyDisplay } from './components/EnemyDisplay';
import { Goblin } from 'imports/engine/enemy/enemies/Goblin';
import { HealthBar } from './components/HealthBar';
import CardHand from './cards/CardHand';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { LoginForm } from './auth/LoginForm';
import { AccountRegistrationForm } from './AccountRegistrationForm';

export const App = () => {
  const [enemy, setEnemy] = useState(new Goblin());
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const user = useTracker(() => Meteor.user());
  const cards = {
    card1: {
      name: 'ferocious',
      currentCost: 10,
      currentAttack: 10,
      description: 'a nice description',
    },
    card2: {
      name: 'i <3 OTK',
      currentCost: 20,
      currentAttack: 9,
      description: 'a scrappy description',
    },
    card3: {
      name: 'fog clearing',
      currentCost: 0,
      currentAttack: null,
      description: 'no description here',
    },
    card4: {
      name: 'transcode',
      currentCost: 40,
      currentAttack: 8,
      description: 'uhhhhh',
    },
    card5: {
      name: 'some card',
      currentCost: 1000,
      currentAttack: 34,
      description: 'a lame description',
    },
    card6: {
      name: 'another card',
      currentCost: 2,
      currentAttack: 1,
      description: 'a great description!',
    },
    card7: {
      name: 'yet another card',
      currentCost: 5,
      currentAttack: 4,
      description: 'running out of ideas',
    },
    card8: {
      name: 'last card',
      currentCost: 8,
      currentAttack: 3,
      description: 'quite tricky',
    },
    card9: {
      name: 'just kidding!',
      currentCost: 5,
      currentAttack: 4,
      description: 'some description',
    },
    card10: {
      name: 'lets',
      currentCost: 8,
      currentAttack: 3,
      description:
        "card with a super duper long description that probably will not be used in the game for real. I honestly don't think any card will require a description this long",
    },
    card11: {
      name: 'play',
      currentCost: 5,
      currentAttack: 4,
      description: 'c',
    },
    card12: { name: 'a', currentCost: 8, currentAttack: 3, description: 'b' },
    card13: {
      name: 'game',
      currentCost: 5,
      currentAttack: 4,
      description: 'a',
    },
    card14: {
      name: 'surprise! super long name for a card that has no real effect at all, everythign is hardcoded',
      currentCost: 8,
      currentAttack: 3,
      description: 'hello!',
    },
  };

  // NOTE: do not use this handle attack method in the game, use the enemy.damage method to apply damage
  const handleAttack = () => {
    setEnemy((prev) => {
      const newHealth = prev.currentHealth - 5;
      newHealth <= 0 ? setIsVisible(false) : setIsVisible(true);
      const updated = new Goblin({ ...prev, currentHealth: newHealth });
      return updated;
    });

    setIsTakingDamage(true);
    setTimeout(() => setIsTakingDamage(false), 400);
  };

  /*
  return (
    <div className="page">
                  <HealthBar
                    current={enemy.currentHealth}
                    max={enemy.health}
                    name={enemy.name}
                  />
      <EnemyDisplay enemy={enemy} isVisible={isVisible} isTakingDamage={isTakingDamage} />
      <button onClick={handleAttack}>Attack</button>
      <CardHand cards={cards} />
  );
  */

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
    //   <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    //     <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full">
    //       <h1 className="text-3xl font-bold text-slate-800 mb-4">
    //         Welcome back, {user.username}!
    //       </h1>

    //       <p className="text-slate-600 mb-8">
    //         You are successfully logged in.
    //       </p>

    //       <button
    //         onClick={() => Meteor.logout()}
    //         className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </div>
    // );
    <CardHand cards={cards} />
  );
};
