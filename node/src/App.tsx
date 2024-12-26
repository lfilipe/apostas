import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { CompetitionsList } from './pages/Competitions/CompetitionsList';
import { MatchesList } from './pages/Matches/MatchesList';
import { RankingList } from './pages/Rankings/RankingList';
import { MyBets } from './pages/Bets/MyBets';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/competitions" replace />} />
              <Route path="competitions" element={<CompetitionsList />} />
              <Route path="competitions/:idSeason/:competitionId/matches" element={<MatchesList />} />
              <Route path="bets" element={<MyBets />} />
              <Route path="ranking" element={<RankingList />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
} 