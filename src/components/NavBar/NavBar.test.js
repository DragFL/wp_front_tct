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
import cartReducer, { addItemToCart } from '../../redux/features/cart/cartSlice';
import themeReducer from '../../redux/features/theme/themeSlice';

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
    const store = configureStore({
        reducer: {
          theme: themeReducer,
          cart: cartReducer,
        },
        preloadedState: {
          theme: { mode: initialThemeMode },
          cart: { 
            items: initialCartQuantity > 0 
              ? [{ id: 1, name: 'Mock Item', price: 10, quantity: 1, totalPrice: 10 }] 
              : [], 
            totalQuantity: initialCartQuantity,
            totalAmount: initialCartQuantity * 10, 
          },
        },
      });

    useSelector.mockImplementation((selector) => {
      return selector(store.getState());
    });

    return { ...render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme(initialThemeMode)}>
          <NavBar />
        </ThemeProvider>
      </Provider>
    ), store };
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

  test('opens and closes the cart modal', () => {
    renderNavBar();
    fireEvent.click(screen.getByLabelText('cart'));
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  test('opens and closes the payment modal', () => {
    const { store } = renderNavBar('light', 1);
    store.dispatch(addItemToCart({ id: 1, name: 'Test Item', price: 10 }));
  
    fireEvent.click(screen.getByLabelText('cart'));
    fireEvent.click(screen.getByText('Pay with credit card'));
    expect(screen.getByText('Credit Card and Delivery Information')).toBeInTheDocument();
  });
  
  test('opens and closes the summary modal', () => {
    const { store } = renderNavBar('light', 1);
    store.dispatch(addItemToCart({ id: 1, name: 'Test Item', price: 10 }));
  
    fireEvent.click(screen.getByLabelText('cart'));
    fireEvent.click(screen.getByText('Pay with credit card'));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Card Holder Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '1234567890123456' } });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/CVC/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Identification Number/i), { target: { value: '123456789' } });
    
    const identificationTypeSelect = screen.getByLabelText(/Identification Type/i);
    fireEvent.mouseDown(identificationTypeSelect);
    const option = screen.getByText('Cédula de Ciudadanía');
    fireEvent.click(option);

    fireEvent.click(screen.getByText('Submit Payment'));
    expect(screen.getByText('Payment Summary')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Confirm Payment'));
    expect(screen.queryByText('Payment Summary')).not.toBeInTheDocument();
  });
});