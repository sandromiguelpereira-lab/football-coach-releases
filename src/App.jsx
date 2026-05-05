// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Login from './pages/Login';
import Registo from './pages/Registo';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00AA00',      // Verde Fayal Sport Club
      light: '#33BB33',
      dark: '#008800',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',      // Branco
      light: '#ffffff',
      dark: '#f5f5f5',
      contrastText: '#00AA00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#00AA00',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#00AA00',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#008800',
          },
        },
      },
    },
  },
});

function RotaPrivada({ children }) {
  const [autenticado, setAutenticado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAutenticado(!!user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return <div>A carregar...</div>;
  }

  return autenticado ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          
          <Route
            path="/dashboard"
            element={
              <RotaPrivada>
                <Layout>
                  <Dashboard />
                </Layout>
              </RotaPrivada>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
