import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  Chip,
  Divider,
  Avatar,
  Skeleton,
  useTheme,
  Snackbar,
  Stack,
  Drawer,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';
import { getFifaMatches } from '../../services/fifaApi';
import { Match } from '../../types';
import { BetDialog } from '../../components/BetDialog';
import api from '../../services/api';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';

interface MatchWithBet extends Match {
  hasBet?: boolean;
}

export function MatchesList() {
  const theme = useTheme();
  const [matches, setMatches] = useState<MatchWithBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [betDialogOpen, setBetDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { idSeason, competitionId } = useParams();

  // Estados dos filtros
  const [statusFilter, setStatusFilter] = useState('all');
  const [onlyWithOdds, setOnlyWithOdds] = useState(false);
  const [onlyNotBet, setOnlyNotBet] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [idSeason, competitionId]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Carregando partidas:', { idSeason, competitionId });
      const matchesData = await getFifaMatches(idSeason || '', competitionId || '');
      console.log('Partidas carregadas:', matchesData);
      console.log('Status dos jogos:', matchesData.map(m => ({ id: m.id, status: m.status })));
      
      const betsResponse = await api.get('/bets');
      console.log('Resposta de apostas:', betsResponse.data);
      
      const userBets = new Set(
        Array.isArray(betsResponse.data) 
          ? betsResponse.data.map((bet: any) => bet.matchId)
          : Array.isArray(betsResponse.data.bets)
            ? betsResponse.data.bets.map((bet: any) => bet.matchId)
            : []
      );
      
      const matchesWithBets = matchesData.map(match => ({
        ...match,
        hasBet: userBets.has(match.id)
      }));
      
      setMatches(matchesWithBets);
    } catch (err) {
      console.error('Erro ao carregar partidas:', err);
      setError('Erro ao carregar partidas. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBet = async (homeScore: number, awayScore: number) => {
    if (!selectedMatch) return;

    try {
      setLoading(true);
      await api.post('/bets', {
        matchId: selectedMatch.id,
        homeTeamScore: homeScore,
        awayTeamScore: awayScore,
      });

      setBetDialogOpen(false);
      setSelectedMatch(null);
      await loadMatches();
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao fazer aposta:', err);
      setError('Não foi possível registrar sua aposta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return theme.palette.error.main;
      case 'FINISHED':
        return theme.palette.success.main;
      case 'SCHEDULED':
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'Ao Vivo';
      case 'FINISHED':
        return 'Encerrado';
      case 'SCHEDULED':
        return 'Agendado';
      default:
        return status;
    }
  };

  const filteredMatches = matches.filter(match => {
    if (statusFilter !== 'all' && match.status !== statusFilter) return false;
    if (onlyWithOdds && !match.odds) return false;
    if (onlyNotBet && match.hasBet) return false;
    return true;
  });

  const filterDrawer = (
    <Box sx={{ width: 280, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Filtros
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
          Status do Jogo
        </FormLabel>
        <RadioGroup
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="Todos" />
          <FormControlLabel value="SCHEDULED" control={<Radio />} label="Agendados" />
          <FormControlLabel value="LIVE" control={<Radio />} label="Ao Vivo" />
          <FormControlLabel value="FINISHED" control={<Radio />} label="Encerrados" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
          Opções Adicionais
        </FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              checked={onlyWithOdds}
              onChange={(e) => setOnlyWithOdds(e.target.checked)}
            />
          }
          label="Apenas jogos com odds"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={onlyNotBet}
              onChange={(e) => setOnlyNotBet(e.target.checked)}
            />
          }
          label="Apenas jogos não apostados"
        />
      </FormControl>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          setStatusFilter('all');
          setOnlyWithOdds(false);
          setOnlyNotBet(false);
        }}
        sx={{ mb: 2 }}
      >
        Limpar Filtros
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Jogos
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((skeleton) => (
            <Grid item xs={12} md={6} key={skeleton}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={60} height={30} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                  <Skeleton variant="rectangular" height={36} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadMatches}>
              Tentar Novamente
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <SportsSoccerIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Jogos
          </Typography>
        </Box>
        <IconButton
          onClick={() => setFilterDrawerOpen(true)}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {filteredMatches.map((match) => (
          <Grid item xs={12} md={6} key={match.id}>
            <Card 
              elevation={3}
              sx={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {new Date(match.matchDateTime).toLocaleString('pt-BR', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}
                  </Typography>
                  <Chip
                    label={getStatusLabel(match.status)}
                    sx={{ 
                      color: 'white',
                      bgcolor: getStatusColor(match.status),
                      fontWeight: 'bold'
                    }}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Avatar 
                      src={match.homeTeamPictureUrl} 
                      alt={match.homeTeam}
                      sx={{ width: 56, height: 56, mb: 1 }}
                    >
                      {match.homeTeam.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                      {match.homeTeam}
                    </Typography>
                  </Box>

                  {match.status !== 'SCHEDULED' ? (
                    <Box sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {match.homeScore}
                      </Typography>
                      <Typography variant="h4" sx={{ mx: 1, color: 'text.secondary' }}>
                        -
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {match.awayScore}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h5" sx={{ mx: 2, color: 'text.secondary' }}>
                      vs
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Avatar 
                      src={match.awayTeamPictureUrl} 
                      alt={match.awayTeam}
                      sx={{ width: 56, height: 56, mb: 1 }}
                    >
                      {match.awayTeam.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                      {match.awayTeam}
                    </Typography>
                  </Box>
                </Box>

                {match.stage && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center"
                    sx={{ mb: 2 }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {match.stage}
                    {match.group && ` - ${match.group}`}
                  </Typography>
                )}

                {match.odds && (
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    justifyContent="center" 
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      size="small"
                      label={`Casa: ${match.odds.homeWin.toFixed(2)}`}
                      variant="outlined"
                      sx={{ flex: 1, fontWeight: 'medium' }}
                    />
                    <Chip
                      size="small"
                      label={`Empate: ${match.odds.draw.toFixed(2)}`}
                      variant="outlined"
                      sx={{ flex: 1, fontWeight: 'medium' }}
                    />
                    <Chip
                      size="small"
                      label={`Fora: ${match.odds.awayWin.toFixed(2)}`}
                      variant="outlined"
                      sx={{ flex: 1, fontWeight: 'medium' }}
                    />
                  </Stack>
                )}

                {match.status === 'SCHEDULED' && (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={match.hasBet}
                    onClick={() => {
                      if (!match.hasBet) {
                        setSelectedMatch(match);
                        setBetDialogOpen(true);
                      }
                    }}
                    sx={{ 
                      mt: 2,
                      bgcolor: match.hasBet ? 'success.main' : 'primary.main',
                      '&:hover': {
                        bgcolor: match.hasBet ? 'success.dark' : 'primary.dark',
                      }
                    }}
                  >
                    {match.hasBet ? 'Já Apostou ✓' : 'Apostar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <BetDialog
        open={betDialogOpen}
        match={selectedMatch}
        onClose={() => {
          setBetDialogOpen(false);
          setSelectedMatch(null);
        }}
        onSubmit={handleBet}
      />

      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '12px 0 0 12px',
            boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {filterDrawer}
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'success.main',
            color: 'white',
          }
        }}
      >
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          sx={{ 
            width: '100%',
            alignItems: 'center',
            bgcolor: 'success.main',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          Aposta registrada com sucesso!
        </Alert>
      </Snackbar>
    </Container>
  );
} 