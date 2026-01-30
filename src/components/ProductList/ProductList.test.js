import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from './ProductList';
import productsReducer from '../../redux/features/product/productSlice';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from '../../theme'; // Import getTheme function

// Mock initial state for the products slice
const mockProducts = [
  { id: 1, name: 'T-Shirt', description: 'A nice t-shirt.', price: 20, image: 't-shirt.jpg', stock: 5 },
  { id: 2, name: 'Mug', description: 'A cool mug.', price: 10, image: 'mug.jpg', stock: 15 },
];

const mockStore = configureStore({
  reducer: {
    products: productsReducer,
  },
  preloadedState: {
    products: {
      products: mockProducts,
      status: 'succeeded',
      error: null,
    },
  },
});

describe('ProductList', () => {
  const theme = getTheme('light'); // Get a light theme for testing

  test('renders a list of products', () => {
    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <ProductList />
        </ThemeProvider>
      </Provider>
    );

    // Check that both product names are rendered
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Mug')).toBeInTheDocument();

    // Check that it renders the correct number of product cards
    // We can check for a repeating element, like the "Add to Cart" button
    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(addToCartButtons).toHaveLength(mockProducts.length);
  });
});
