// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  SportsSoccer
} from '@mui/icons-material';
import { loginUtilizador } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (!email || !password) {
      setErro('Preencha todos os campos');
      setCarregando(false);
      return;
    }

    const resultado = await loginUtilizador(email, password);
    
    if (resultado.success) {
      navigate('/dashboard');
    } else {
      setErro(resultado.message);
    }
    
    setCarregando(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <SportsSoccer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography component="h1" variant="h4" gutterBottom>
          Football Coach Platform
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Gestão profissional para treinadores
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 3, width: '100%' }}>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={mostrarPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={carregando}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      edge="end"
                    >
                      {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={carregando}
            >
              {carregando ? 'A entrar...' : 'Entrar'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/recuperar-password"
                variant="body2"
                sx={{ display: 'block', mb: 1 }}
              >
                Esqueceu a password?
              </Link>
              
              <Typography variant="body2" color="text.secondary">
                Ainda não tem conta?{' '}
                <Link component={RouterLink} to="/registo" variant="body2">
                  Registe-se aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
          © 2025 Football Coach Platform. Todos os direitos reservados.
        </Typography>
      </Box>
    </Container>
  );
}
