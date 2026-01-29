import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import theme from './theme';
import ProductList from './components/ProductList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" gutterBottom>
          Wompi Storefront
        </Typography>
        <ProductList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
