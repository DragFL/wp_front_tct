import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/features/theme/themeSlice';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import CartModal from '../CartModal/CartModal';
import PaymentModal from '../PaymentModal/PaymentModal';
import SummaryModal from '../SummaryModal/SummaryModal';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

function NavBar() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleCartModalOpen = () => {
    setCartModalOpen(true);
  };

  const handleCartModalClose = () => {
    setCartModalOpen(false);
  };

  const handlePaymentModalOpen = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
  };

  const handleSummaryModalOpen = () => {
    setSummaryModalOpen(true);
  };

  const handleSummaryModalClose = () => {
    setSummaryModalOpen(false);
  };

  const handleCheckout = () => {
    handleCartModalClose();
    handlePaymentModalOpen();
  };

  const handlePaymentSubmit = () => {
    handlePaymentModalClose();
    handleSummaryModalOpen();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Storefront
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={handleThemeToggle} color="inherit" aria-label="toggle light/dark mode">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton aria-label="cart" color="inherit" onClick={handleCartModalOpen}>
          <StyledBadge badgeContent={totalQuantity} color="secondary">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>
        <Button color="inherit">Login</Button>
      </Toolbar>
      <CartModal open={cartModalOpen} handleClose={handleCartModalClose} handleCheckout={handleCheckout} />
      <PaymentModal open={paymentModalOpen} handleClose={handlePaymentModalClose} handlePaymentSubmit={handlePaymentSubmit} />
      <SummaryModal open={summaryModalOpen} handleClose={handleSummaryModalClose} totalAmount={totalAmount} />
    </AppBar>
  );
}

export default NavBar;
