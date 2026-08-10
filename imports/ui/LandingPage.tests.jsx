import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { LandingPage } from './LandingPage.jsx';

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
            it('shows a confirmation prompt on first click when a save exists', function () {
                const originalCall = Meteor.call;
                let called = false;
                Meteor.call = () => { called = true; };

                render(<LandingPage hasSave={true} onStart={() => { }} />);
                fireEvent.click(screen.getByText('New Game'));

                assert.exists(screen.getByText(/overwrite your current save/i));
                assert.isFalse(called);
                Meteor.call = originalCall;
            });

            it('calls game.newGame when Overwrite is confirmed', function () {
                let calledWith = null;
                const originalCall = Meteor.call;
                Meteor.call = (name, cb) => { calledWith = name; cb(null); };

                render(<LandingPage hasSave={true} onStart={() => { }} />);
                fireEvent.click(screen.getByText('New Game'));
                fireEvent.click(screen.getByText('Overwrite'));

                assert.equal(calledWith, 'game.newGame');
                Meteor.call = originalCall;
            });

            it('calls onStart after Overwrite succeeds', function () {
                let callCount = 0;
                const onStart = () => { callCount++; };
                const originalCall = Meteor.call;
                Meteor.call = (name, cb) => cb(null);

                render(<LandingPage hasSave={true} onStart={onStart} />);
                fireEvent.click(screen.getByText('New Game'));
                fireEvent.click(screen.getByText('Overwrite'));

                assert.equal(callCount, 1);
                Meteor.call = originalCall;
            });
        });
    });
}