import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';

const ProductList = () => {
  const products = useSelector((state) => state.products.products);

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
