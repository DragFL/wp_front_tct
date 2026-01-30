import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { toggleTheme } from '../../redux/features/theme/themeSlice'; // Import toggleTheme action
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for light mode
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

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
  const mode = useSelector((state) => state.theme.mode); // Get current theme mode

  // Placeholder for cart item count - in a real app, this would come from Redux state
  const cartItemCount = 0; 

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
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
        <IconButton aria-label="cart" color="inherit">
          <StyledBadge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>
        <Button color="inherit">Login</Button> {/* Example button */}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
