import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from '../../theme'; // Import getTheme function

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Awesome T-Shirt',
    description: 'A really awesome t-shirt that you will love.',
    price: 25,
    image: 'https://via.placeholder.com/300x300.png?text=T-Shirt',
    stock: 10,
  };

  const theme = getTheme('light'); // Get a light theme for testing

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
});
