import cartReducer, { addItemToCart, removeItemFromCart, updateItemQuantity } from './cartSlice';

describe('cartSlice', () => {
  const blankState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };

  // Keep a reference to the original getItem
  const originalGetItem = Storage.prototype.getItem;

  beforeEach(() => {
    // Restore localStorage to its original state
    Storage.prototype.getItem = originalGetItem;
    localStorage.clear();
    jest.resetModules(); // Reset modules before each test
  });

  afterAll(() => {
    // Clean up and restore original localStorage functions after all tests
    Storage.prototype.getItem = originalGetItem;
  });

  it('should return the initial state from localStorage if available', () => {
    const savedCart = {
      items: [{ id: 1, name: 'Saved Product', price: 50, quantity: 1, totalPrice: 50 }],
      totalQuantity: 1,
      totalAmount: 50,
    };
    // Mock getItem to return the saved cart
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'cartItems') {
        return JSON.stringify(savedCart);
      }
      return null;
    });

    // Re-import the reducer to get the fresh initial state based on the mock
    const { default: cartReducerWithSavedState } = require('./cartSlice');
    const newState = cartReducerWithSavedState(undefined, {});
    expect(newState).toEqual(savedCart);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('cartItems');
  });

  it('should return the blank initial state if no localStorage data', () => {
    // Mock getItem to return null
    Storage.prototype.getItem = jest.fn(() => null);

    // Re-import the reducer to get the fresh initial state based on the mock
    const { default: cartReducerWithBlankState } = require('./cartSlice');
    const newState = cartReducerWithBlankState(undefined, {});
    expect(newState).toEqual(blankState);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('cartItems');
  });

  describe('addItemToCart', () => {
    const initialState = {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
    };

    it('should add a new item to an empty cart', () => {
      const product = { id: 1, name: 'Product 1', price: 10 };
      const newState = cartReducer(initialState, addItemToCart(product));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 1, totalPrice: 10 },
      ]);
      expect(newState.totalQuantity).toBe(1);
      expect(newState.totalAmount).toBe(10);
    });

    it('should add an existing item to the cart (increment quantity)', () => {
      const product = { id: 1, name: 'Product 1', price: 10 };
      const stateWithOneItem = cartReducer(initialState, addItemToCart(product));
      const newState = cartReducer(stateWithOneItem, addItemToCart(product));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 2, totalPrice: 20 },
      ]);
      expect(newState.totalQuantity).toBe(2);
      expect(newState.totalAmount).toBe(20);
    });

    it('should add multiple different items to the cart', () => {
      const product1 = { id: 1, name: 'Product 1', price: 10 };
      const product2 = { id: 2, name: 'Product 2', price: 20 };
      let newState = cartReducer(initialState, addItemToCart(product1));
      newState = cartReducer(newState, addItemToCart(product2));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 1, totalPrice: 10 },
        { id: 2, name: 'Product 2', price: 20, quantity: 1, totalPrice: 20 },
      ]);
      expect(newState.totalQuantity).toBe(2);
      expect(newState.totalAmount).toBe(30);
    });
  });

  describe('removeItemFromCart', () => {
    const product = { id: 1, name: 'Product 1', price: 10 };
    let stateWithTwoItems;
    const initialState = { // Define initialState for this describe block
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
    };

    beforeEach(() => {
      stateWithTwoItems = cartReducer(initialState, addItemToCart(product));
      stateWithTwoItems = cartReducer(stateWithTwoItems, addItemToCart(product));
    });

    it('should decrement quantity if item quantity is greater than 1', () => {
      const newState = cartReducer(stateWithTwoItems, removeItemFromCart(product.id));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 1, totalPrice: 10 },
      ]);
      expect(newState.totalQuantity).toBe(1);
      expect(newState.totalAmount).toBe(10);
    });

    it('should remove item completely if item quantity is 1', () => {
      const stateWithOneItem = cartReducer(initialState, addItemToCart(product));
      const newState = cartReducer(stateWithOneItem, removeItemFromCart(product.id));
      expect(newState.items).toEqual([]);
      expect(newState.totalQuantity).toBe(0);
      expect(newState.totalAmount).toBe(0);
    });

    it('should not change state if item does not exist', () => {
      const newState = cartReducer(stateWithTwoItems, removeItemFromCart(999));
      expect(newState).toEqual(stateWithTwoItems);
    });
  });

  describe('updateItemQuantity', () => {
    const product = { id: 1, name: 'Product 1', price: 10 };
    let stateWithOneItem;
    const initialState = { // Define initialState for this describe block
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
    };

    beforeEach(() => {
      stateWithOneItem = cartReducer(initialState, addItemToCart(product));
    });

    it('should increase item quantity', () => {
      const newState = cartReducer(stateWithOneItem, updateItemQuantity({ id: product.id, quantity: 3 }));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 3, totalPrice: 30 },
      ]);
      expect(newState.totalQuantity).toBe(3);
      expect(newState.totalAmount).toBe(30);
    });

    it('should decrease item quantity', () => {
      const stateWithThreeItems = cartReducer(stateWithOneItem, updateItemQuantity({ id: product.id, quantity: 3 }));
      const newState = cartReducer(stateWithThreeItems, updateItemQuantity({ id: product.id, quantity: 1 }));
      expect(newState.items).toEqual([
        { id: 1, name: 'Product 1', price: 10, quantity: 1, totalPrice: 10 },
      ]);
      expect(newState.totalQuantity).toBe(1);
      expect(newState.totalAmount).toBe(10);
    });

    it('should remove item if quantity is set to 0', () => {
      const newState = cartReducer(stateWithOneItem, updateItemQuantity({ id: product.id, quantity: 0 }));
      expect(newState.items).toEqual([]);
      expect(newState.totalQuantity).toBe(0);
      expect(newState.totalAmount).toBe(0);
    });

    it('should not change state if item does not exist', () => {
      const newState = cartReducer(stateWithOneItem, updateItemQuantity({ id: 999, quantity: 5 }));
      expect(newState).toEqual(stateWithOneItem);
    });
  });
});
