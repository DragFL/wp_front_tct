import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryModal from './SummaryModal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('SummaryModal', () => {
  const renderWithProviders = (component) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  test('renders summary modal with correct amounts', () => {
    const totalAmount = 100;
    renderWithProviders(
      <SummaryModal open={true} handleClose={() => {}} totalAmount={totalAmount} />
    );

    expect(screen.getByText('Payment Summary')).toBeInTheDocument();
    expect(screen.getByText('Products Total')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Delivery Fee')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Base Fee')).toBeInTheDocument();
    expect(screen.getByText('$1.50')).toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getByText('$106.50')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Payment' })).toBeInTheDocument();
  });

  test('calls handleClose when Confirm Payment button is clicked', () => {
    const handleClose = jest.fn();
    const totalAmount = 100;
    renderWithProviders(
      <SummaryModal open={true} handleClose={handleClose} totalAmount={totalAmount} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Payment' }));
    expect(handleClose).toHaveBeenCalled();
  });
});
