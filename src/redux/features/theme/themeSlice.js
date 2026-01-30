import { createSlice } from '@reduxjs/toolkit';

// Function to get the initial theme mode
const getInitialMode = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  }
  // Default for non-browser environments (like SSR)
  return 'light';
};

const initialState = {
  mode: getInitialMode(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
