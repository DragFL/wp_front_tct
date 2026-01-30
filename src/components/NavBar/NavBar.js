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
import CartModal from '../CartModal/CartModal'; // Import CartModal

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
  const cartItemCount = useSelector((state) => state.cart.totalQuantity); // Get cart item count from Redux

  const [cartModalOpen, setCartModalOpen] = useState(false); // State for CartModal visibility

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleCartModalOpen = () => {
    setCartModalOpen(true);
  };

  const handleCartModalClose = () => {
    setCartModalOpen(false);
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
        <IconButton aria-label="cart" color="inherit" onClick={handleCartModalOpen}> {/* Add onClick handler */}
          <StyledBadge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>
        <Button color="inherit">Login</Button>
      </Toolbar>
      <CartModal open={cartModalOpen} handleClose={handleCartModalClose} /> {/* Render CartModal */}
    </AppBar>
  );
}

export default NavBar;
