import themeReducer, { toggleTheme } from './themeSlice';

describe('themeSlice', () => {
  const originalMatchMedia = window.matchMedia;
  const originalGetItem = Storage.prototype.getItem;

  beforeEach(() => {
    // Reset mocks and modules before each test
    jest.resetModules();
    Storage.prototype.getItem = originalGetItem;
    window.matchMedia = originalMatchMedia;
    localStorage.clear();
  });

  afterAll(() => {
    // Restore original functions after all tests
    Storage.prototype.getItem = originalGetItem;
    window.matchMedia = originalMatchMedia;
  });

  describe('initial state', () => {
    it("should initialize with 'dark' mode if localStorage has 'dark'", () => {
      Storage.prototype.getItem = jest.fn((key) => (key === 'themeMode' ? 'dark' : null));
      const { default: themeReducerWithMock } = require('./themeSlice');
      const state = themeReducerWithMock(undefined, {});
      expect(state.mode).toBe('dark');
    });

    it("should initialize with 'light' mode if localStorage has 'light'", () => {
      Storage.prototype.getItem = jest.fn((key) => (key === 'themeMode' ? 'light' : null));
      const { default: themeReducerWithMock } = require('./themeSlice');
      const state = themeReducerWithMock(undefined, {});
      expect(state.mode).toBe('light');
    });

    it("should initialize with 'dark' mode if user prefers dark scheme and localStorage is empty", () => {
      Storage.prototype.getItem = jest.fn(() => null);
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
        })),
      });
      const { default: themeReducerWithMock } = require('./themeSlice');
      const state = themeReducerWithMock(undefined, {});
      expect(state.mode).toBe('dark');
    });

    it("should initialize with 'light' mode if user prefers light scheme and localStorage is empty", () => {
      Storage.prototype.getItem = jest.fn(() => null);
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query !== '(prefers-color-scheme: dark)',
        })),
      });
      const { default: themeReducerWithMock } = require('./themeSlice');
      const state = themeReducerWithMock(undefined, {});
      expect(state.mode).toBe('light');
    });

    it("should default to 'light' mode in a non-browser environment", () => {
        const originalWindow = global.window;
        delete global.window;

        const { default: themeReducerWithMock } = require('./themeSlice');
        const state = themeReducerWithMock(undefined, {});
        expect(state.mode).toBe('light');

        global.window = originalWindow;
    });

    it("should default to 'light' mode if matchMedia is not supported", () => {
        Storage.prototype.getItem = jest.fn(() => null);
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: undefined,
        });
        const { default: themeReducerWithMock } = require('./themeSlice');
        const state = themeReducerWithMock(undefined, {});
        expect(state.mode).toBe('light');
    });
  });

  describe('toggleTheme reducer', () => {
    it('should switch state from light to dark', () => {
      const initialState = { mode: 'light' };
      const action = toggleTheme();
      const newState = themeReducer(initialState, action);
      expect(newState.mode).toBe('dark');
    });

    it('should switch state from dark to light', () => {
      const initialState = { mode: 'dark' };
      const action = toggleTheme();
      const newState = themeReducer(initialState, action);
      expect(newState.mode).toBe('light');
    });
  });
});
