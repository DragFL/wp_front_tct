import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NavBar from './NavBar';
import getTheme from '../../theme';
import { ThemeProvider } from '@mui/material/styles';

describe('NavBar', () => {
  // Mock localStorage and matchMedia before each test
  beforeEach(() => {
    jest.resetModules(); // Reset modules to re-evaluate imports

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
    });
  });

  const createTestStore = () => {
    const themeSlice = require('../../redux/features/theme/themeSlice');
    return configureStore({
      reducer: {
        theme: themeSlice.default,
      },
    });
  };

  test('renders with light theme by default', () => {
    const store = createTestStore();
    expect(store.getState().theme.mode).toBe('light');

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(store.getState().theme.mode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();
  });

  test('initializes with dark theme if system preference is dark', () => {
    window.matchMedia.mockImplementation(query => ({ matches: true }));
    const store = createTestStore();
    expect(store.getState().theme.mode).toBe('dark');

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(store.getState().theme.mode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
  });

  test('initializes with dark theme if localStorage is set to dark', () => {
    window.localStorage.getItem.mockImplementation(() => 'dark');
    const store = createTestStore();
    expect(store.getState().theme.mode).toBe('dark');

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(store.getState().theme.mode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
  });

  test('toggles theme by dispatching toggleTheme action', () => {
    const { toggleTheme } = require('../../redux/features/theme/themeSlice');
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(store.getState().theme.mode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle light\/dark mode/i });
    fireEvent.click(toggleButton);

    expect(dispatchSpy).toHaveBeenCalledWith(toggleTheme());
  });
});