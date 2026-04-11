import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    //  (Neutral Colors)
    background: {
      default: '#f8fafc', // slate-50
      paper: '#ffffff',   
    },
    text: {
      primary: '#0f172a', // slate-900 
      secondary: '#1e293b', // slate-800
    },
    
    // (Primary/Accent)
    primary: {
      light: '#e0e7ff', // indigo-100
      main: '#6366f1',  // indigo-500 
      dark: '#3b35ae',  // indigo-600
      contrastText: '#fff', // Text on button
    },

    // Semantic
    success: {
      main: '#22c55e',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    
    // 
    slate: {
      50: '#f8fafc',
      200: '#e2e8f0', 
      800: '#1e293b',
      900: '#0f172a',
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, 
      },
      styleOverrides: {
        root: {
          textTransform: 'none', 
          borderRadius: 8,      
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small', 
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});



export default theme;
