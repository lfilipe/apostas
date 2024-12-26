export interface Match {
  id: string;
  idMatch: string;
  competitionId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamPictureUrl?: string;
  awayTeamPictureUrl?: string;
  matchDateTime: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Competition {
  id: string;
  idCompetition: string;
  idSeason: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 