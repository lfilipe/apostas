export interface FifaCompetition {
  id: string;
  label: string;
  idSeason: string;
  idCompetition: string;
  order: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  imageUrl: string;
  additionalInfo?: any;
}

export interface Match {
  id: string;
  competitionId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamPictureUrl?: string;
  awayTeamPictureUrl?: string;
  matchDateTime: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  stage?: string;
  group?: string | null;
  odds?: BettingOdd;
  createdAt: string;
  updatedAt: string;
  bets?: Bet[];
}

export interface BettingOdd {
  id: string;
  matchId: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  homeTeamScore: number;
  awayTeamScore: number;
  points: number;
  isMatchedResult: boolean;
  createdAt: string;
  updatedAt: string;
  match: Match;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  totalPoints: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Competition {
  id: string;
  idSeason: string;
  idCompetition: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
} 