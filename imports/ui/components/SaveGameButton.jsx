import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export function SaveGameButton({ gameState }) {
    const [message, setMessage] = useState('');

    const handleSaveGame = () => {
        Meteor.call('userData.saveGameState', { gameState }, (error) => {
            if (error) {
                setMessage(error.reason || 'Failed to save game.');
                return;
            }

            setMessage('Game saved successfully.');
        });
    };

    return (
        <div>
            <button
                className="px-6 py-2.5 bg-green-800 hover:bg-green-700 text-white font-semibold rounded-lg text-lg transition-colors"
                onClick={handleSaveGame}
            >
                Save Game
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}