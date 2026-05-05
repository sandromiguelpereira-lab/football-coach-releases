// src/pages/Registo.jsx
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
import { registarUtilizador } from '../services/authService';

export default function Registo() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    clube: '',
    password: '',
    confirmarPassword: ''
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validarFormulario = () => {
    if (!formData.nome || !formData.email || !formData.clube || 
        !formData.password || !formData.confirmarPassword) {
      setErro('Preencha todos os campos');
      return false;
    }

    if (formData.password.length < 6) {
      setErro('A password deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmarPassword) {
      setErro('As passwords não coincidem');
      return false;
    }

    return true;
  };

  const handleRegisto = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    const resultado = await registarUtilizador(
      formData.email,
      formData.password,
      formData.nome,
      formData.clube
    );
    
    if (resultado.success) {
      setSucesso(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setErro(resultado.message);
    }
    
    setCarregando(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <SportsSoccer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography component="h1" variant="h4" gutterBottom>
          Criar Nova Conta
        </Typography>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Comece a gerir a sua equipa hoje
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 3, width: '100%' }}>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Conta criada com sucesso! A redirecionar...
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegisto}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome Completo"
              name="nome"
              autoComplete="name"
              autoFocus
              value={formData.nome}
              onChange={handleChange}
              disabled={carregando}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={carregando}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="clube"
              label="Clube / Equipa"
              name="clube"
              placeholder="Ex: FC Porto Sub-19"
              value={formData.clube}
              onChange={handleChange}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={carregando}
              helperText="Mínimo 6 caracteres"
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmarPassword"
              label="Confirmar Password"
              type={mostrarPassword ? 'text' : 'password'}
              id="confirmarPassword"
              autoComplete="new-password"
              value={formData.confirmarPassword}
              onChange={handleChange}
              disabled={carregando}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={carregando}
            >
              {carregando ? 'A criar conta...' : 'Criar Conta'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Já tem conta?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Faça login aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
