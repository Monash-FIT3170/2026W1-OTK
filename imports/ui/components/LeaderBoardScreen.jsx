import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserDataCollection } from '../../api/user-data/collections/UserDataCollection';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Global Training Mode leaderboard — the top 10 players by
 * trainingHighScore, plus the logged-in player's own rank underneath if
 * they're not already in that top 10.
 *
 * Reads from the leaderboard.topTrainingScores publication, which only
 * ever exposes userId/username/trainingHighScore for the top 10 across
 * all players — never a full user document. Own rank comes from a
 * separate userData.getMyTrainingRank call rather than being derivable
 * from the top 10 alone.
 *
 * @param {() => void} onBack - leave the leaderboard, back to the landing page
 */
export function LeaderboardScreen({ onBack }) {
  const { topScores, loading } = useTracker(() => {
    const sub = Meteor.subscribe('leaderboard.topTrainingScores');
    const topScores = UserDataCollection.find(
      { trainingHighScore: { $gt: 0 } },
      { sort: { trainingHighScore: -1 } }
    ).fetch();
    return { topScores, loading: !sub.ready() };
  });

  const [myRank, setMyRank] = useState(undefined); // undefined = not loaded yet
  const myUserId = Meteor.userId();

  useEffect(() => {
    Meteor.call('userData.getMyTrainingRank', (err, result) => {
      if (err) {
        console.error('userData.getMyTrainingRank failed:', err);
        setMyRank(null);
        return;
      }
      setMyRank(result);
    });
  }, []);

  const isInTopList = topScores.some((entry) => entry.userId === myUserId);

  return (
    <div className="min-h-screen w-screen bg-slate-900">
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-400">Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Most damage dealt in a single Training Mode session
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-slate-800 overflow-hidden">
          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading...</p>
          ) : topScores.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No scores yet — be the first to set one in Training Mode!
            </p>
          ) : (
            <ul>
              {topScores.map((entry, index) => {
                const isMe = entry.userId === myUserId;
                return (
                  <li
                    key={entry._id}
                    className={`flex items-center justify-between px-5 py-3 ${
                      index !== topScores.length - 1
                        ? 'border-b border-slate-700'
                        : ''
                    } ${isMe ? 'bg-emerald-900/40' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-8 text-lg font-semibold">
                        {MEDALS[index] ?? `#${index + 1}`}
                      </span>
                      <span
                        className={`font-semibold ${
                          isMe ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {entry.username ?? 'Player'}
                        {isMe ? ' (you)' : ''}
                      </span>
                    </div>
                    <span className="text-slate-200 font-mono">
                      {entry.trainingHighScore}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!loading && !isInTopList && (
          <p className="text-slate-400 text-sm">
            {myRank === undefined && 'Checking your rank...'}
            {myRank === null && "You haven't set a Training Mode score yet."}
            {myRank && (
              <>
                Your rank:{' '}
                <span className="text-emerald-400 font-semibold">
                  #{myRank.rank}
                </span>{' '}
                ({myRank.score} damage)
              </>
            )}
          </p>
        )}

        <button
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          onClick={onBack}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default LeaderboardScreen;