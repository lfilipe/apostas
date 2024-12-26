export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export interface Match {
  idMatch: string;
  idSeason: string;
  competitionId: string;
  matchDateTime: Date;
  status: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamScore?: number;
  homeTeamPicture: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamScore?: number;
  awayTeamPicture: string;
  odds?: MatchOdds;
} 