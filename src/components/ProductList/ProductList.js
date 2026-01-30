import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid'; // Import the new Grid v2
import ProductCard from '../ProductCard/ProductCard';

const ProductList = () => {
  const products = useSelector((state) => state.products.products);

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
