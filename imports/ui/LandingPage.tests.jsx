import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { LandingPage } from './LandingPage.jsx';

const renderLandingPage = (props) => {
    const LandingPageHarness = () => {
        const [isNewGameSetup, setIsNewGameSetup] = useState(false);
        const [difficulty, setDifficulty] = useState('easy');

        return (
            <LandingPage
                {...props}
                isNewGameSetup={isNewGameSetup}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                onOpenNewGameSetup={() => setIsNewGameSetup(true)}
                onBackToMenu={() => setIsNewGameSetup(false)}
            />
        );
    };

    return render(<LandingPageHarness />);
};

if (Meteor.isClient) {
    describe('LandingPage', function () {
        describe('Continue button', function () {
            it('renders when a save exists', function () {
                render(<LandingPage hasSave={true} onStart={() => { }} />);
                assert.exists(screen.getByText('Continue'));
            });

            it('does not render when no save exists', function () {
                render(<LandingPage hasSave={false} onStart={() => { }} />);
                assert.isNull(screen.queryByText('Continue'));
            });

            it('calls onStart when clicked', function () {
                let callCount = 0;
                const onStart = () => { callCount++; };

                render(<LandingPage hasSave={true} onStart={onStart} />);
                fireEvent.click(screen.getByText('Continue'));

                assert.equal(callCount, 1);
            });

            it('does not call any Meteor method when clicked', function () {
                let called = false;
                const originalCall = Meteor.call;
                Meteor.call = () => { called = true; };

                render(<LandingPage hasSave={true} onStart={() => { }} />);
                fireEvent.click(screen.getByText('Continue'));

                assert.isFalse(called);
                Meteor.call = originalCall;
            });
        });

        describe('New Game button', function() {
            it('opens setup before replacing an existing save', function () {
                const originalCall = Meteor.call;
                let called = false;
                Meteor.call = () => { called = true; };

                renderLandingPage({ hasSave: true, onStart: () => { } });
                assert.exists(screen.getByText('Edit Deck'));
                fireEvent.click(screen.getByText('New Game'));

                assert.exists(screen.getByText('New Game Setup'));
                assert.exists(screen.getByRole('button', { name: 'Difficulty: Easy' }));
                assert.isNull(screen.queryByText('Edit Deck'));
                assert.isFalse(called);
                Meteor.call = originalCall;
            });

            it('calls game.newGame when Overwrite is confirmed', function () {
                let calledWith = null;
                const originalCall = Meteor.call;
                Meteor.call = (name, difficulty, cb) => { calledWith = [name, difficulty]; cb(null); };

                renderLandingPage({ hasSave: true, onStart: () => { } });
                fireEvent.click(screen.getByText('New Game'));
                fireEvent.click(screen.getByRole('button', { name: 'Difficulty: Easy' }));
                fireEvent.click(screen.getByRole('button', { name: 'Hard' }));
                fireEvent.click(screen.getByText('Start New Game'));
                assert.exists(screen.getByText(/overwrite your current save/i));
                fireEvent.click(screen.getByText('Overwrite'));

                assert.deepEqual(calledWith, ['game.newGame', 'hard']);
                Meteor.call = originalCall;
            });

            it('calls onStart after Overwrite succeeds', function () {
                let callCount = 0;
                const onStart = () => { callCount++; };
                const originalCall = Meteor.call;
                Meteor.call = (name, difficulty, cb) => cb(null);

                renderLandingPage({ hasSave: true, onStart });
                fireEvent.click(screen.getByText('New Game'));
                fireEvent.click(screen.getByText('Start New Game'));
                fireEvent.click(screen.getByText('Overwrite'));

                assert.equal(callCount, 1);
                Meteor.call = originalCall;
            });
        });
    });
}