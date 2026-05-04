import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { EnemyList } from './components';

export const App = () => {
  const [enemies, setEnemies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spawning, setSpawning] = useState(false);
  const observerRef = useRef(null);

  const handleSpawnEnemy = async (enemyId) => {
    setSpawning(true);
    try {
      await new Promise((resolve, reject) => {
        Meteor.call('enemy.spawn', enemyId, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
    } catch (error) {
      console.error('Failed to spawn enemy:', error);
      alert(`Error spawning enemy: ${error.message}`);
    } finally {
      setSpawning(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    
    const subscription = Meteor.subscribe('enemies.all', {
      onReady() {
        setLoading(false);
      },
      onError(error) {
        console.error('Subscription error:', error);
        setLoading(false);
      },
    });

    return () => {
      subscription.stop();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      // Don't set up observer if it already exists
      if (observerRef.current) {
        return;
      }

      // Import collection here to avoid issues
      import('../api/enemy/collections/Enemies.js').then(
        ({ EnemiesCollection }) => {
          // Don't set up if observer was already created
          if (observerRef.current) {
            return;
          }

          // Initial fetch
          const enemyData = EnemiesCollection.find({}).fetch();
          setEnemies(enemyData);

          // Watch for real-time changes
          const observer = EnemiesCollection.find({}).observe({
            added(doc) {
              setEnemies((prev) => {
                if (prev.some((e) => e._id === doc._id)) {
                  return prev;
                }
                return [...prev, doc];
              });
            },
            changed(newDoc, oldDoc) {
              setEnemies((prev) =>
                prev.map((enemy) => (enemy._id === newDoc._id ? newDoc : enemy))
              );
            },
            removed(oldDoc) {
              setEnemies((prev) =>
                prev.filter((enemy) => enemy._id !== oldDoc._id)
              );
            },
          });

          observerRef.current = observer;
        }
      );
    }

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.stop();
        observerRef.current = null;
      }
    };
  }, [loading]);

  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Game Status</h1>
        
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => handleSpawnEnemy('goblin')}
            disabled={spawning || loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
          >
            {spawning ? 'Spawning...' : 'Spawn Goblin'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading enemies...</p>
          </div>
        ) : (
          <EnemyList enemies={enemies} />
        )}
      </div>
    </div>
  );
};
