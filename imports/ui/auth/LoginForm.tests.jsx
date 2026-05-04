import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { LoginForm } from './LoginForm.jsx';

if (Meteor.isClient) {
  describe('LoginForm', function () {
    let loginWithPasswordOriginal;

    beforeEach(function () {
      loginWithPasswordOriginal = Meteor.loginWithPassword;
    });

    afterEach(function () {
      Meteor.loginWithPassword = loginWithPasswordOriginal;
    });

    it('renders the login form', function () {
      render(<LoginForm />);
      assert.exists(screen.getByRole('heading', { name: 'Login' }));
      assert.exists(screen.getByLabelText(/username or email/i));
      assert.exists(screen.getByLabelText(/password/i));
      assert.exists(screen.getByRole('button', { name: /sign in/i }));
    });

    it('handles username and password input', function () {
      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      assert.equal(usernameInput.value, 'testuser');
      assert.equal(passwordInput.value, 'password123');
    });

    it('calls Meteor.loginWithPassword on submit', async function () {
      let callCount = 0;
      let calledArgs = null;
      Meteor.loginWithPassword = (username, password, callback) => {
        callCount++;
        calledArgs = { username, password };
        callback(); // Success
      };

      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        assert.equal(callCount, 1);
        assert.deepEqual(calledArgs, { username: 'testuser', password: 'password123' });
      });
    });

    it('displays error message on login failure', async function () {
      Meteor.loginWithPassword = (username, password, callback) => {
        callback({ reason: 'User not found' }); // Simulate failure
      };

      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        assert.exists(screen.getByText('User not found'));
      });
    });
  });
}
