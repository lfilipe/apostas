import axios from 'axios';
import type { Match, Competition } from '../types';
import { prisma } from '../lib/prisma';

interface FifaMatchResponse {
  Results: Array<{
    IdMatch: string;
    IdSeason: string;
    IdCompetition: string;
    Home: {
      TeamName: Array<{ Description: string }>;
      Score: number | null;
      PictureUrl: string;
    } | null;
    Away: {
      TeamName: Array<{ Description: string }>;
      Score: number | null;
      PictureUrl: string;
    } | null;
    Date: string;
    LocalDate: string;
    MatchStatus: number;
    PlaceHolderA: string;
    PlaceHolderB: string;
    StageName: Array<{ Description: string }>;
    GroupName: Array<{ Description: string }> | null;
  }>;
}

export class CompetitionService {
  private readonly fifaApi = axios.create({
    baseURL: 'https://api.fifa.com/api/v3'
  });

  async syncMatches(competition: Competition): Promise<Match[]> {
    try {
      const response = await this.fifaApi.get<FifaMatchResponse>(
        `/calendar/matches?idseason=${competition.idSeason}&idcompetition=${competition.idCompetition}&count=500&language=pt`
      );

      const matches = await Promise.all(
        response.data.Results.map(async (match) => {
          const homeTeamName = match.Home?.TeamName?.[0]?.Description || match.PlaceHolderA;
          const awayTeamName = match.Away?.TeamName?.[0]?.Description || match.PlaceHolderB;
          const stage = match.StageName[0].Description;
          const group = match.GroupName?.[0]?.Description;
          const date = new Date(match.Date);

          return prisma.match.upsert({
            where: {
              id: match.IdMatch
            },
            update: {
              homeTeamName,
              awayTeamName,
              matchDateTime: match.Date,
              status: this.getMatchStatus(match.MatchStatus),
              homeTeamScore: match.Home?.Score ?? null,
              awayTeamScore: match.Away?.Score ?? null
            },
            create: {
              id: match.IdMatch,
              idMatch: match.IdMatch,
              competitionId: competition.id,
              homeTeamId: match.IdMatch + '_home',
              awayTeamId: match.IdMatch + '_away',
              homeTeamName,
              awayTeamName,
              matchDateTime: match.Date,
              status: this.getMatchStatus(match.MatchStatus),
              homeTeamScore: match.Home?.Score ?? null,
              awayTeamScore: match.Away?.Score ?? null
            }
          });
        })
      );

      return matches.map(match => ({
        id: match.id,
        idMatch: match.id,
        competitionId: match.competitionId,
        homeTeam: match.homeTeamName,
        awayTeam: match.awayTeamName,
        matchDateTime: match.matchDateTime,
        status: match.status,
        homeScore: match.homeTeamScore,
        awayScore: match.awayTeamScore,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt
      }));
    } catch (error) {
      console.error('Erro ao sincronizar jogos com a FIFA:', error);
      throw new Error('Erro ao sincronizar jogos com a FIFA');
    }
  }

  private getMatchStatus(status: number): string {
    switch (status) {
      case 1:
        return 'SCHEDULED';
      case 2:
        return 'LIVE';
      case 0:
        return 'FINISHED';
      default:
        return 'UNKNOWN';
    }
  }
} 