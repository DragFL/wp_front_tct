import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentModal from './PaymentModal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const theme = createTheme();

describe('PaymentModal', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            theme: { mode: 'light' },
            cart: { items: [], totalAmount: 0, totalQuantity: 0 }
        });
    });

    const renderWithProviders = (component) => {
        return render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    {component}
                </ThemeProvider>
            </Provider>
        );
    };

    test('renders payment modal with form fields when open', () => {
        renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);

        expect(screen.getByText('Credit Card and Delivery Information')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /full name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /mobile number/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /card holder name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /card number/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /expiration date/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /cvc/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /identification type/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /identification number/i })).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /number of payments/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit Payment' })).toBeInTheDocument();
    });

    test('does not render when closed', () => {
        renderWithProviders(<PaymentModal open={false} handleClose={() => {}} />);
        expect(screen.queryByText('Credit Card and Delivery Information')).not.toBeInTheDocument();
    });

    describe('Validation', () => {
        test('shows required errors on submit when fields are empty', async () => {
            const handleClose = jest.fn();
            renderWithProviders(<PaymentModal open={true} handleClose={handleClose} />);
            
            fireEvent.click(screen.getByRole('button', { name: 'Submit Payment' }));

            await waitFor(() => {
                expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
                expect(screen.getByText('Email is required.')).toBeInTheDocument();
                expect(screen.getByText('Mobile Number is required.')).toBeInTheDocument();
                expect(screen.getByText('Card Holder Name is required.')).toBeInTheDocument();
                expect(screen.getByText('Card Number is required.')).toBeInTheDocument();
                expect(screen.getByText('Expiration Date is required.')).toBeInTheDocument();
                expect(screen.getByText('CVC is required.')).toBeInTheDocument();
                expect(screen.getByText('Identification Type is required.')).toBeInTheDocument();
                expect(screen.getByText('Identification Number is required.')).toBeInTheDocument();
            });

            expect(handleClose).not.toHaveBeenCalled();
        });

        test('shows format error for invalid email', async () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);

            fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'invalid-email' } });
            fireEvent.click(screen.getByRole('button', { name: 'Submit Payment' }));

            await waitFor(() => {
                expect(screen.getByText('Email is not valid.')).toBeInTheDocument();
            });
        });

        test('clears error when user starts typing', async () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);
            
            fireEvent.click(screen.getByRole('button', { name: 'Submit Payment' }));

            await waitFor(() => {
                expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
            });

            fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), { target: { value: 'John Doe' } });

            await waitFor(() => {
                expect(screen.queryByText('Full Name is required.')).not.toBeInTheDocument();
            });
        });

        test('sanitizes mobile number input', () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);
            const mobileInput = screen.getByLabelText(/mobile number/i);
            fireEvent.change(mobileInput, { target: { value: '123-456-7890' } });
            expect(mobileInput.value).toBe('1234567890');
        });
    
        test('sanitizes card number input', () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);
            const cardInput = screen.getByLabelText(/card number/i);
            fireEvent.change(cardInput, { target: { value: '1234-5678-9012-3456' } });
            expect(cardInput.value).toBe('1234567890123456');
        });
    
        test('sanitizes CVC input', () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);
            const cvcInput = screen.getByLabelText(/cvc/i);
            fireEvent.change(cvcInput, { target: { value: '123a4' } });
            expect(cvcInput.value).toBe('1234');
        });
    
        test('sanitizes full name input', () => {
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} />);
            const nameInput = screen.getByLabelText(/full name/i);
            fireEvent.change(nameInput, { target: { value: 'John123' } });
            expect(nameInput.value).toBe('John');
        });

        test('submits the form when all fields are valid', async () => {
            const handlePaymentSubmit = jest.fn();
            renderWithProviders(<PaymentModal open={true} handleClose={() => {}} handlePaymentSubmit={handlePaymentSubmit} />);

            fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
            fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
            fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '1234567890' } });
            fireEvent.change(screen.getByLabelText(/card holder name/i), { target: { value: 'John Doe' } });
            fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567890123456' } });
            fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/25' } });
            fireEvent.change(screen.getByLabelText(/cvc/i), { target: { value: '123' } });
            fireEvent.change(screen.getByLabelText(/identification number/i), { target: { value: '123456789' } });
            fireEvent.change(screen.getByLabelText(/number of payments/i), { target: { value: '1' } });
            
            const identificationTypeSelect = screen.getByLabelText(/identification type/i);
            fireEvent.mouseDown(identificationTypeSelect);
            const option = screen.getByText('Cédula de Ciudadanía');
            fireEvent.click(option);

            fireEvent.click(screen.getByRole('button', { name: 'Submit Payment' }));

            await waitFor(() => {
                expect(handlePaymentSubmit).toHaveBeenCalled();
            });
        });
    });
});
