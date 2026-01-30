import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import getTheme from './theme'; // Import getTheme function
import NavBar from './components/NavBar/NavBar'; // Import NavBar
import ProductList from './components/ProductList/ProductList';

function App() {
  const mode = useSelector((state) => state.theme.mode); // Get theme mode from Redux
  const theme = getTheme(mode); // Create theme object based on mode

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar /> {/* Render NavBar here */}
      <Container maxWidth="lg">
        <ProductList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
