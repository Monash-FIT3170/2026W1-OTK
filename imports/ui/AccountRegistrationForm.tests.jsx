import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountRegistrationForm } from './AccountRegistrationForm';

if (Meteor.isClient) {
  describe('AccountRegistrationForm', function() {
    it('renders all fields', function() {
      render(<AccountRegistrationForm />);
      screen.getByLabelText('Username');
      screen.getByLabelText('Email');
      screen.getByLabelText('Password');
    });

    it('renders the sign up button', function() {
      render(<AccountRegistrationForm />);
      screen.getByRole('button', { name: /sign up/i });
    });

    it('shows error when server returns one', async function() {
      Meteor.call = (method, args, cb) => cb({ error: 'auth.usernameTaken', reason: 'Username is already taken.' });
      
      render(<AccountRegistrationForm />);
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }).closest('form'));
      await screen.findByText('Username is already taken.');
    });
  });
}