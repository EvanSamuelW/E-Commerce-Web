import { createTheme } from '@mui/material/styles'; // Import ThemeProvider

export const theme = createTheme({
    palette: {
      primary: {
        main: '#333333', // Dark Gray
      },
      secondary: {
        main: '#666666', // Medium Gray
      },
      background: {
        default: '#F4F4F4', // Light Gray
        paper: '#E0E0E0', // Slightly darker gray for card backgrounds
      },
      text: {
        primary: '#111111', // Very Dark Gray for text
        secondary: '#666666', // Lighter gray for secondary text
      },
    },
  });