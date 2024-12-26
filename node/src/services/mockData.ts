import { Competition, Match, Bet, User } from '../types';

export const mockCompetitions: Competition[] = [
  {
    id: '1',
    idCompetition: '10005',
    idSeason: '289175',
    name: 'FIFA Club World Cup 2025™',
    startDate: '2025-06-15T00:00:00Z',
    endDate: '2025-07-13T00:00:00Z',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockRanking: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'USER',
    totalPoints: 120
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'USER',
    totalPoints: 150
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@example.com',
    role: 'USER',
    totalPoints: 90
  }
];

export const mockMatches: Match[] = [
  {
    id: '1',
    competitionId: '1',
    homeTeam: 'A Definir',
    awayTeam: 'A Definir',
    matchDateTime: '2025-06-15T19:00:00Z',
    status: 'SCHEDULED',
    homeScore: null,
    awayScore: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    competitionId: '1',
    homeTeam: 'A Definir',
    awayTeam: 'A Definir',
    matchDateTime: '2025-06-16T19:00:00Z',
    status: 'SCHEDULED',
    homeScore: null,
    awayScore: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockBets: Bet[] = [
  {
    id: '1',
    userId: '1',
    matchId: '1',
    homeTeamScore: 2,
    awayTeamScore: 1,
    points: 0,
    isMatchedResult: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    match: mockMatches[0]
  }
]; 