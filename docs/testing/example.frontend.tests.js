import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import NoteItem from './NoteItem.jsx';

describe('NoteItem', function () {
  it('renders the title', function () {
    render(<NoteItem note={{ title: 'Groceries', body: 'Milk, Eggs' }} />);
    expect(screen.getByText('Groceries')).to.exist;
  });

  it('renders the body', function () {
    render(<NoteItem note={{ title: 'Groceries', body: 'Milk, Eggs' }} />);
    expect(screen.getByText('Milk, Eggs')).to.exist;
  });
});
