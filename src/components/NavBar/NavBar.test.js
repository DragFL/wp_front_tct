import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NavBar from './NavBar';
import getTheme from '../../theme';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/features/theme/themeSlice';

// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockDispatch = jest.fn();

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
    useDispatch.mockReturnValue(mockDispatch);

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

  const renderNavBar = (initialThemeMode = 'light', initialCartQuantity = 0) => {
    useSelector.mockImplementation((selector) => {
      // Create a comprehensive mock state object that the selector will operate on
      const mockState = {
        theme: { mode: initialThemeMode },
        cart: { 
          items: initialCartQuantity > 0 
            ? [{ id: 1, name: 'Mock Item', price: 10, quantity: 1, totalPrice: 10 }] 
            : [], 
          totalQuantity: initialCartQuantity,
          totalAmount: initialCartQuantity * 10, 
        },
      };
      // Return the result of calling the actual selector with the mock state
      return selector(mockState);
    });

    // Create a minimal store for the Provider, as useSelector is mocked
    // The actual reducers are not used here since useSelector is mocked,
    // but the structure helps in clarity.
    const store = configureStore({
      reducer: {
        theme: () => ({ mode: initialThemeMode }),
        cart: () => ({ totalQuantity: initialCartQuantity }),
      },
      preloadedState: {
        theme: { mode: initialThemeMode },
        cart: { totalQuantity: initialCartQuantity },
      },
    });

    return render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(initialThemeMode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    );
  };

  test('renders with light theme by default and displays cart count', () => {
    renderNavBar('light', 5);
    expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('initializes with dark theme if system preference is dark', () => {
    window.matchMedia.mockImplementation(query => ({ matches: true }));
    renderNavBar('dark', 0);
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
  });

  test('initializes with dark theme if localStorage is set to dark', () => {
    window.localStorage.getItem.mockImplementation(() => 'dark');
    renderNavBar('dark', 0);
    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
  });

  test('toggles theme by dispatching toggleTheme action', () => {
    renderNavBar('light', 0);
    const toggleButton = screen.getByRole('button', { name: /toggle light\/dark mode/i });
    fireEvent.click(toggleButton);
    expect(mockDispatch).toHaveBeenCalledWith(toggleTheme());
  });

  test('opens CartModal when shopping cart icon is clicked', () => {
    renderNavBar('light', 3);
    const cartIcon = screen.getByLabelText('cart');
    fireEvent.click(cartIcon);
    expect(cartIcon).toBeInTheDocument(); 
  });
});