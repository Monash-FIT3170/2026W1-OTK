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
    });
}