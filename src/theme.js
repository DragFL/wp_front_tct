import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#556cd6',
          },
          secondary: {
            main: '#19857b',
          },
          background: {
            default: '#fff',
            paper: '#fff',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#3f51b5',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: '#121212',
            paper: '#121212',
          },
        }),
  },
});

export default getTheme;
