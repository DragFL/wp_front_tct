import store from './store';
import productsReducer from './features/product/productSlice';
import cartReducer, { addItemToCart } from './features/cart/cartSlice';
import themeReducer, { toggleTheme } from './features/theme/themeSlice';

describe('Redux Store', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it('should have the correct reducers', () => {
        const rootReducer = store.getState();
        expect(rootReducer).toHaveProperty('products');
        expect(rootReducer).toHaveProperty('cart');
        expect(rootReducer).toHaveProperty('theme');
    });
    it('should be configured with the correct initial state', () => {
        const initialState = {
            products: productsReducer(undefined, {}),
            cart: cartReducer(undefined, {}),
            theme: themeReducer(undefined, {}),
        };
        expect(store.getState()).toEqual(initialState);
    });
    it('should update localStorage when the theme is changed', () => {
        store.dispatch(toggleTheme());
        expect(localStorage.getItem('themeMode')).toBe('dark');
        store.dispatch(toggleTheme());
        expect(localStorage.getItem('themeMode')).toBe('light');
    });
    it('should update localStorage when the cart is changed', () => {
        const product = { id: 1, name: 'T-Shirt', price: 20 };
        store.dispatch(addItemToCart(product));
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        expect(cartItems.items).toHaveLength(1);
        expect(cartItems.items[0].name).toBe('T-Shirt');
    });
});
