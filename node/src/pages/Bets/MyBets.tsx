import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  SportsSoccer as SoccerIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Bet } from '../../types';
import { mockBets, mockMatches } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';

export function MyBets() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    try {
      // Simulando uma chamada à API
      setTimeout(() => {
        setBets(mockBets);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Erro ao carregar apostas');
      setLoading(false);
    }
  };

  const getMatchDetails = (matchId: string) => {
    return mockMatches.find((match) => match.id === matchId);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Minhas Apostas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Acompanhe suas apostas e pontuações
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <TrophyIcon sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item>
            <Typography variant="h6">
              Total de Pontos: {user?.totalPoints}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {bets.map((bet) => {
          const match = getMatchDetails(bet.matchId);
          return (
            <Grid item xs={12} sm={6} key={bet.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      icon={<SoccerIcon />}
                      label={match ? `${match.homeTeam} vs ${match.awayTeam}` : 'Jogo não encontrado'}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={bet.isMatchedResult ? <CheckIcon /> : <CancelIcon />}
                      label={bet.isMatchedResult ? 'Acertou!' : 'Errou'}
                      color={bet.isMatchedResult ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Seu Palpite: {bet.homeTeamScore} x {bet.awayTeamScore}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Data da aposta: {new Date(bet.createdAt).toLocaleDateString()}
                    </Typography>
                    <Chip
                      icon={<TrophyIcon />}
                      label={`${bet.points} pontos`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {bets.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Você ainda não fez nenhuma aposta
          </Typography>
        </Box>
      )}
    </Container>
  );
} 