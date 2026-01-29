import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/product/productSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export default store;
