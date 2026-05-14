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
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-colors"
                onClick={handleSaveGame}
            >
                Save Game
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}