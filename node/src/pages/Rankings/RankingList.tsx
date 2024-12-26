import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Looks3 as ThirdIcon,
  LooksTwo as SecondIcon,
  LooksOne as FirstIcon,
} from '@mui/icons-material';
import { User } from '../../types';
import { mockRanking } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface RankingUser extends User {
  position: number;
}

export function RankingList() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      // Simulando uma chamada à API
      setTimeout(() => {
        const rankedUsers = mockRanking
          .sort((a: User, b: User) => b.totalPoints - a.totalPoints)
          .map((user: User, index: number) => ({
            ...user,
            position: index + 1,
          }));
        setUsers(rankedUsers);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Erro ao carregar ranking');
      setLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <FirstIcon sx={{ fontSize: 40, color: 'gold' }} />;
      case 2:
        return <SecondIcon sx={{ fontSize: 40, color: 'silver' }} />;
      case 3:
        return <ThirdIcon sx={{ fontSize: 40, color: '#CD7F32' }} />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ranking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Confira a classificação dos apostadores
        </Typography>
      </Box>

      {users.map((user) => (
        <Paper
          key={user.id}
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: user.id === currentUser?.id ? 'action.selected' : 'background.paper',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.01)',
            },
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={1}>
              {getPositionIcon(user.position) || (
                <Typography variant="h6" color="text.secondary">
                  {user.position}º
                </Typography>
              )}
            </Grid>
            <Grid item xs={2} sm={1}>
              <Avatar
                sx={{
                  bgcolor: user.id === currentUser?.id ? 'primary.main' : 'secondary.main',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            </Grid>
            <Grid item xs={6} sm={7}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TrophyIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="primary">
                  {user.totalPoints}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
} 