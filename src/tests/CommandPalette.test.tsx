import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import App from '../App';

describe('Orixa Command Palette Interface', () => {
  test('Pressing Command shortcut or trigger opens the Command Palette overlay', () => {
    // Render the App component
    render(<App />);
    
    // Command Palette should not be visible initially
    expect(screen.queryByPlaceholderText(/search Orixa operations/i)).toBeNull();

    // Trigger keydown with Ctrl+K
    fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });

    // Input should now be in the document
    const searchInput = screen.getByPlaceholderText(/search Orixa operations/i);
    expect(searchInput).toBeTruthy();
  });

  test('Filtering commands displays appropriate matches', () => {
    render(<App />);
    
    // Open palette
    fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    
    const searchInput = screen.getByPlaceholderText(/search Orixa operations/i);
    
    // Type a specific filter term
    fireEvent.change(searchInput, { target: { value: 'DataHub' } });
    
    // Navigation items that match 'DataHub' should be present
    expect(screen.getByText(/Go to Context Catalog \(DataHub\)/i)).toBeTruthy();
    
    // Items that don't match like 'Replay' should be filtered out
    expect(screen.queryByText(/Go to Incident Replay/i)).toBeNull();
  });
});
