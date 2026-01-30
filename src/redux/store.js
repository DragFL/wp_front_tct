import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/product/productSlice';
import themeReducer from './features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    theme: themeReducer,
  },
});

// Subscribe to store changes to save the theme mode
store.subscribe(() => {
  const state = store.getState();
  if (typeof window !== 'undefined') {
    localStorage.setItem('themeMode', state.theme.mode);
  }
});

export default store;
