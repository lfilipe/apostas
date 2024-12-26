export interface Bet {
  matchId: string;
  homeScore: number;
  awayScore: number;
  selectedOdd: 'home' | 'draw' | 'away';
} 