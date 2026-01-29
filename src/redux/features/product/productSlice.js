import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    {
      id: 1,
      name: 'Awesome T-Shirt',
      description: 'A really awesome t-shirt that you will love.',
      price: 25,
      stock: 10,
      image: 'https://via.placeholder.com/300x300.png?text=T-Shirt'
    },
    {
      id: 2,
      name: 'Cool Mug',
      description: 'A very cool mug for your coffee.',
      price: 15,
      stock: 20,
      image: 'https://via.placeholder.com/300x300.png?text=Mug'
    },
    {
      id: 3,
      name: 'Super Cap',
      description: 'A super cap to protect you from the sun.',
      price: 20,
      stock: 15,
      image: 'https://via.placeholder.com/300x300.png?text=Cap'
    },
  ],
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.stock -= quantity;
      }
    },
  },
});

export const { updateStock } = productSlice.actions;

export default productSlice.reducer;
