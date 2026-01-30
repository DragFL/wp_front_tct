import productReducer, { updateStock } from './productSlice';

describe('productSlice', () => {
  const initialState = {
    products: [
      { id: 1, name: 'Awesome T-Shirt', stock: 10 },
      { id: 2, name: 'Cool Mug', stock: 20 },
    ],
  };

  it('should return the initial state', () => {
    expect(productReducer(undefined, {})).toEqual({
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
    });
  });

  describe('updateStock reducer', () => {
    it('should decrease the stock of a product with a positive quantity', () => {
      const action = updateStock({ id: 1, quantity: 5 });
      const newState = productReducer(initialState, action);
      const updatedProduct = newState.products.find((p) => p.id === 1);
      expect(updatedProduct.stock).toBe(5);
    });

    it('should increase the stock of a product with a negative quantity', () => {
        const action = updateStock({ id: 2, quantity: -5 });
        const newState = productReducer(initialState, action);
        const updatedProduct = newState.products.find((p) => p.id === 2);
        expect(updatedProduct.stock).toBe(25);
    });

    it('should not change the stock if quantity is 0', () => {
        const action = updateStock({ id: 1, quantity: 0 });
        const newState = productReducer(initialState, action);
        expect(newState).toEqual(initialState);
    });

    it('should not change state if product id does not exist', () => {
      const action = updateStock({ id: 999, quantity: 5 });
      const newState = productReducer(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });
});
