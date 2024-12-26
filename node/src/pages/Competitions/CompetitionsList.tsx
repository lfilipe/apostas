import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { SportsSoccer as SoccerIcon, Event as EventIcon } from '@mui/icons-material';
import { FifaCompetition } from '../../types';
import { getFifaCompetition } from '../../services/fifaApi';

export function CompetitionsList() {
  const [competitions, setCompetitions] = useState<FifaCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      // Por enquanto, vamos carregar apenas o Mundial de Clubes
      const competition = await getFifaCompetition('289175', '10005');
      setCompetitions([competition]);
      setLoading(false);
    } catch (err: any) {
      setError('Erro ao carregar competições');
      setLoading(false);
    }
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
          Competições
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Escolha uma competição para ver os jogos disponíveis e fazer suas apostas
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {competitions.map((competition) => (
          <Grid item xs={12} sm={6} md={4} key={competition.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={competition.imageUrl}
                alt={competition.label}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={competition.isActive ? 'Em andamento' : 'Finalizada'}
                    color={competition.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Typography variant="h5" component="div" gutterBottom>
                  {competition.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(competition.startDate).toLocaleDateString()} -{' '}
                    {new Date(competition.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SoccerIcon />}
                  onClick={() => navigate(`/competitions/${competition.idSeason}/${competition.idCompetition}/matches`)}
                >
                  Ver Jogos
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 