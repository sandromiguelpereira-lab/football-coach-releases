// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  People,
  FitnessCenter,
  CalendarToday,
  SportsSoccer,
  TrendingUp,
  Add
} from '@mui/icons-material';
import { obterUtilizadorAtual } from '../services/authService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [utilizador, setUtilizador] = useState(null);

  useEffect(() => {
    const user = obterUtilizadorAtual();
    if (!user) {
      navigate('/login');
    } else {
      setUtilizador(user);
    }
  }, [navigate]);

  const estatisticas = [
    {
      titulo: 'Atletas',
      valor: '0',
      icone: <People fontSize="large" />,
      cor: '#00AA00',
      link: '/atletas'
    },
    {
      titulo: 'Treinos',
      valor: '0',
      icone: <FitnessCenter fontSize="large" />,
      cor: '#008800',
      link: '/treinos'
    },
    {
      titulo: 'Próximo Jogo',
      valor: 'Nenhum',
      icone: <SportsSoccer fontSize="large" />,
      cor: '#33BB33',
      link: '/jogos'
    },
    {
      titulo: 'Exercícios',
      valor: '50+',
      icone: <TrendingUp fontSize="large" />,
      cor: '#00AA00',
      link: '/exercicios'
    }
  ];

  const acoesRapidas = [
    {
      titulo: 'Novo Treino',
      descricao: 'Criar sessão de treino',
      icone: <CalendarToday />,
      acao: () => navigate('/treinos/novo')
    },
    {
      titulo: 'Adicionar Atleta',
      descricao: 'Registar novo jogador',
      icone: <People />,
      acao: () => navigate('/atletas/novo')
    },
    {
      titulo: 'Ver Exercícios',
      descricao: 'Biblioteca completa',
      icone: <FitnessCenter />,
      acao: () => navigate('/exercicios')
    }
  ];

  if (!utilizador) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {utilizador.displayName || 'Treinador'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aqui está o resumo da sua equipa
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {estatisticas.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate(stat.link)}
            >
              <Avatar
                sx={{
                  bgcolor: stat.cor,
                  width: 60,
                  height: 60,
                  mb: 2
                }}
              >
                {stat.icone}
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {stat.valor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.titulo}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Ações Rápidas
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {acoesRapidas.map((acao, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {acao.icone}
                  </Avatar>
                  <Typography variant="h6">
                    {acao.titulo}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {acao.descricao}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Add />}
                  onClick={acao.acao}
                >
                  Criar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Próximos Treinos
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhum treino agendado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece por criar o seu primeiro plano de treino
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => navigate('/treinos/novo')}
          >
            Criar Treino
          </Button>
        </Box>
      </Paper>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mt: 4, 
          background: 'linear-gradient(135deg, #00AA00 0%, #008800 100%)',
          color: 'white'
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Desbloqueie todo o potencial! 🚀
            </Typography>
            <Typography variant="body1">
              Upgrade para o plano Pro e tenha acesso a:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label="Equipas ilimitadas" sx={{ mr: 1, mb: 1, bgcolor: 'white' }} />
              <Chip label="Biblioteca completa" sx={{ mr: 1, mb: 1, bgcolor: 'white' }} />
              <Chip label="Relatórios avançados" sx={{ mr: 1, mb: 1, bgcolor: 'white' }} />
              <Chip label="Análise de jogo" sx={{ mr: 1, mb: 1, bgcolor: 'white' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#00AA00',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              onClick={() => navigate('/planos')}
            >
              Ver Planos
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
