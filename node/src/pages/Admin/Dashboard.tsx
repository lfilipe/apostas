import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  PeopleOutline as UsersIcon,
  SportsSoccer as MatchesIcon,
  EmojiEvents as CompetitionsIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalMatches: number;
  totalCompetitions: number;
  totalBets: number;
  recentBets: Array<{
    id: string;
    user: {
      name: string;
      avatar?: string;
    };
    match: {
      homeTeam: string;
      awayTeam: string;
      homeScore: number;
      awayScore: number;
    };
    points: number;
  }>;
  upcomingMatches: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    matchDateTime: string;
    totalBets: number;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard Administrativo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visão geral e gestão do sistema
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <UsersIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3, position: 'absolute', right: 8, top: 8 }} />
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Usuários
              </Typography>
              <Typography variant="h4">
                {stats?.totalUsers || 0}
              </Typography>
              <Button 
                startIcon={<AddIcon />}
                variant="contained" 
                size="small"
                sx={{ 
                  mt: 2,
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Adicionar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'success.main',
              color: 'success.contrastText',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <MatchesIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3, position: 'absolute', right: 8, top: 8 }} />
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Partidas
              </Typography>
              <Typography variant="h4">
                {stats?.totalMatches || 0}
              </Typography>
              <Button 
                startIcon={<EditIcon />}
                variant="contained"
                size="small"
                sx={{ 
                  mt: 2,
                  bgcolor: 'success.dark',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                Gerenciar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <CompetitionsIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3, position: 'absolute', right: 8, top: 8 }} />
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Competições
              </Typography>
              <Typography variant="h4">
                {stats?.totalCompetitions || 0}
              </Typography>
              <Button 
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                sx={{ 
                  mt: 2,
                  bgcolor: 'warning.dark',
                  '&:hover': { bgcolor: 'warning.dark' }
                }}
              >
                Nova
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'info.main',
              color: 'info.contrastText',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3, position: 'absolute', right: 8, top: 8 }} />
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Apostas
              </Typography>
              <Typography variant="h4">
                {stats?.totalBets || 0}
              </Typography>
              <Button 
                startIcon={<EditIcon />}
                variant="contained"
                size="small"
                sx={{ 
                  mt: 2,
                  bgcolor: 'info.dark',
                  '&:hover': { bgcolor: 'info.dark' }
                }}
              >
                Visualizar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Seção de Apostas Recentes e Próximas Partidas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Apostas Recentes
              </Typography>
              <Stack spacing={2}>
                {stats?.recentBets?.length === 0 && (
                  <Typography color="text.secondary" align="center">
                    Nenhuma aposta recente
                  </Typography>
                )}
                {stats?.recentBets?.map((bet) => (
                  <Box
                    key={bet.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Avatar src={bet.user.avatar} sx={{ mr: 2 }}>
                      {bet.user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {bet.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bet.match.homeTeam} {bet.match.homeScore} x {bet.match.awayScore} {bet.match.awayTeam}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${bet.points} pts`}
                      color={bet.points > 0 ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Partidas
              </Typography>
              <Stack spacing={2}>
                {stats?.upcomingMatches?.length === 0 && (
                  <Typography color="text.secondary" align="center">
                    Nenhuma partida agendada
                  </Typography>
                )}
                {stats?.upcomingMatches?.map((match) => (
                  <Box
                    key={match.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {match.homeTeam} vs {match.awayTeam}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(match.matchDateTime).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="primary.main">
                        {match.totalBets} apostas
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 