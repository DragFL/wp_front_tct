
import { createSlice } from '@reduxjs/toolkit';

const getSaveCart = () => {
  const blankState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
  
  const savedItems = localStorage.getItem('cartItems');
  
  if (savedItems) {
    return JSON.parse(savedItems);
  } else {
    return blankState;
  }
};

const itemArray = getSaveCart();
const initialState = {
  items: itemArray.items,
  totalQuantity: itemArray.totalQuantity,
  totalAmount: itemArray.totalAmount,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      state.totalAmount += newItem.price;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.name,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
    },
    updateItemQuantity(state, action) {
        const { id, quantity } = action.payload;
        const existingItem = state.items.find(item => item.id === id);
    
        if (existingItem) {
            const quantityDifference = quantity - existingItem.quantity;
            state.totalQuantity += quantityDifference;
            state.totalAmount += quantityDifference * existingItem.price;
            existingItem.quantity = quantity;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
    
            if (existingItem.quantity <= 0) {
                state.items = state.items.filter(item => item.id !== id);
            }
        }
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
