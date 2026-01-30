import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/product/productSlice';
import themeReducer from './features/theme/themeSlice';
import cartReducer from './features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    theme: themeReducer,
    cart: cartReducer,
  },
});

// Subscribe to store changes to save the theme mode
store.subscribe(() => {
  const state = store.getState();
  if (typeof window !== 'undefined') {
    localStorage.setItem('themeMode', state.theme.mode);
  }

  if (state.cart.items.length !== 0) {
    localStorage.setItem('cartItems', JSON.stringify(state.cart))
    console.log("uwU",state.cart.items)
  } else {
    localStorage.removeItem('cartItems')
  }
});

export default store;
