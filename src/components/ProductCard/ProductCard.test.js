import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from '../../theme';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/features/cart/cartSlice';

// Mock useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Mock addItemToCart as well, to ensure we are testing the component's interaction with it
jest.mock('../../redux/features/cart/cartSlice', () => ({
    ...jest.requireActual('../../redux/features/cart/cartSlice'),
    addItemToCart: jest.fn(),
}));


const mockDispatch = jest.fn();

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Awesome T-Shirt',
    description: 'A really awesome t-shirt that you will love.',
    price: 25,
    image: 'https://via.placeholder.com/300x300.png?text=T-Shirt',
    stock: 10,
  };

  const theme = getTheme('light');

  beforeEach(() => {
    mockDispatch.mockClear();
    addItemToCart.mockClear();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test('renders product details correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProductCard product={mockProduct} />
      </ThemeProvider>
    );

    expect(screen.getByText('Awesome T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('A really awesome t-shirt that you will love.')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /awesome t-shirt/i })).toHaveAttribute('src', mockProduct.image);
  });

  test('renders action buttons', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProductCard product={mockProduct} />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  test('dispatches addItemToCart with product when "Add to Cart" button is clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <ProductCard product={mockProduct} />
      </ThemeProvider>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(addToCartButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(addItemToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockDispatch).toHaveBeenCalledWith(addItemToCart(mockProduct));
  });
});
