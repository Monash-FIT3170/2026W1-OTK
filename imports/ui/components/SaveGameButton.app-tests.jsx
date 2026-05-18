import React from 'react';
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SaveGameButton } from './SaveGameButton';

if (Meteor.isClient) {
    describe('SaveGameButton', function () {
        let originalCall;

        beforeEach(function () {
            originalCall = Meteor.call;
        });

        afterEach(function () {
            Meteor.call = originalCall;
            cleanup();
        });

        it('calls userData.saveGameState with the current gameState when clicked', function () {
            const mockGameState = {
                stage: 1,
                hand: [{ cardId: 'slash' }],
                deck: [{ cardId: 'block' }],
                enemy: {
                    enemyId: 'goblin',
                    currentHealth: 15,
                },
            };

            let calledMethod = null;
            let calledPayload = null;

            Meteor.call = function (methodName, payload, callback) {
                calledMethod = methodName;
                calledPayload = payload;

                if (callback) {
                    callback(null);
                }
            };

            render(<SaveGameButton gameState={mockGameState} />);

            fireEvent.click(screen.getByText('Save Game'));

            assert.equal(calledMethod, 'userData.saveGameState');
            assert.deepEqual(calledPayload, {
                gameState: mockGameState,
            });
        });

        it('shows a success message after saving successfully', function () {
            Meteor.call = function (methodName, payload, callback) {
                callback(null);
            };

            render(<SaveGameButton gameState={{ stage: 1 }} />);

            fireEvent.click(screen.getByText('Save Game'));

            assert.exists(screen.getByText('Game saved successfully.'));
        });

        it('shows an error message when saving fails', function () {
            Meteor.call = function (methodName, payload, callback) {
                callback({
                    reason: 'Failed to save game.',
                });
            };

            render(<SaveGameButton gameState={{ stage: 1 }} />);

            fireEvent.click(screen.getByText('Save Game'));

            assert.exists(screen.getByText('Failed to save game.'));
        });
    });
}