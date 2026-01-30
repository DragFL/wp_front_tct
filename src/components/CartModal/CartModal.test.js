import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CartModal from './CartModal';
import { addItemToCart, removeItemFromCart, updateItemQuantity } from '../../redux/features/cart/cartSlice';

const mockStore = configureStore([]);

// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockDispatch = jest.fn();

describe('CartModal', () => {
  let store;
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockDispatch.mockClear();
    mockHandleClose.mockClear();
    require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  });

  it('renders empty cart message when cart is empty', () => {
    store = mockStore({
      cart: {
        items: [],
        totalAmount: 0,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders cart items and total when cart is not empty', () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, name: 'Test Product', price: 10, quantity: 2, totalPrice: 20 },
        ],
        totalAmount: 20,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10.00 x 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $20.00')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });

  it('dispatches addItemToCart when "add one item" is clicked', async () => {
    const product = { id: 1, name: 'Test Product', price: 10, quantity: 1, totalPrice: 10 };
    store = mockStore({
      cart: {
        items: [product],
        totalAmount: 10,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    const addButton = screen.getByLabelText('add one item');
    await userEvent.click(addButton);

    expect(mockDispatch).toHaveBeenCalledWith(addItemToCart(product));
  });

  it('dispatches removeItemFromCart when "remove one item" is clicked', async () => {
    const product = { id: 1, name: 'Test Product', price: 10, quantity: 1, totalPrice: 10 };
    store = mockStore({
      cart: {
        items: [product],
        totalAmount: 10,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    const removeButton = screen.getByLabelText('remove one item');
    await userEvent.click(removeButton);

    expect(mockDispatch).toHaveBeenCalledWith(removeItemFromCart(product.id));
  });

  it('dispatches updateItemQuantity with quantity 0 when "delete item" is clicked', async () => {
    const product = { id: 1, name: 'Test Product', price: 10, quantity: 1, totalPrice: 10 };
    store = mockStore({
      cart: {
        items: [product],
        totalAmount: 10,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    const deleteButton = screen.getByLabelText('delete item');
    await userEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(updateItemQuantity({ id: product.id, quantity: 0 }));
  });

  it('calls handleClose when "Proceed to Checkout" button is clicked', async () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, name: 'Test Product', price: 10, quantity: 1, totalPrice: 10 },
        ],
        totalAmount: 10,
      },
    });
    require('react-redux').useSelector.mockReturnValue(store.getState().cart);

    render(
      <Provider store={store}>
        <CartModal open={true} handleClose={mockHandleClose} />
      </Provider>
    );

    const checkoutButton = screen.getByText('Proceed to Checkout');
    await userEvent.click(checkoutButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
