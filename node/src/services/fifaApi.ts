import axios from 'axios';
import { Match, FifaCompetition } from '../types';

interface FifaMatch {
  IdMatch: string;
  IdStage: string;
  IdGroup: string | null;
  IdSeason: string;
  IdCompetition: string;
  Date: string;
  LocalDate: string;
  Home: {
    IdTeam: string;
    TeamName: Array<{ Description: string }>;
    PictureUrl: string;
    Score: number | null;
  };
  Away: {
    IdTeam: string;
    TeamName: Array<{ Description: string }>;
    PictureUrl: string;
    Score: number | null;
  };
  MatchStatus: number;
  ResultType: string;
  GroupName: Array<{ Description: string }> | null;
  StageName: Array<{ Description: string }>;
}

export async function getFifaCompetition(idSeason: string, idCompetition: string): Promise<FifaCompetition> {
  try {
    const response = await axios.get(
      `https://api.fifa.com/api/v3/seasons/${idCompetition}/${idSeason}?language=pt`
    );

    const data = response.data;
    console.log('Resposta da FIFA:', data);

    return {
      id: `${data.IdSeason}-${data.IdCompetition}`,
      label: data.Name[0].Description,
      idSeason: data.IdSeason,
      idCompetition: data.IdCompetition,
      order: 0,
      isActive: true,
      startDate: data.StartDate,
      endDate: data.EndDate,
      imageUrl: data.PictureUrl?.replace('{format}-{size}', 'sq-6') || ''
    };
  } catch (error) {
    console.error('Erro ao buscar competição:', error);
    throw error;
  }
}

export async function getFifaMatches(idSeason: string, idCompetition: string): Promise<Match[]> {
  try {
    console.log('Buscando partidas:', { idSeason, idCompetition });
    const response = await axios.get(
      `https://api.fifa.com/api/v3/calendar/matches?idSeason=${idSeason}&idCompetition=${idCompetition}&language=pt&count=500`
    );

    console.log('Resposta da FIFA:', response.data);

    return response.data.Results.map((match: FifaMatch) => ({
      id: match.IdMatch,
      competitionId: match.IdCompetition,
      homeTeam: match.Home?.TeamName?.[0]?.Description || 'Time A',
      awayTeam: match.Away?.TeamName?.[0]?.Description || 'Time B',
      homeTeamPictureUrl: match.Home?.PictureUrl?.replace('{format}-{size}', 'sq-2') || '',
      awayTeamPictureUrl: match.Away?.PictureUrl?.replace('{format}-{size}', 'sq-2') || '',
      matchDateTime: match.Date,
      status: getMatchStatus(match.MatchStatus),
      homeScore: match.Home?.Score || null,
      awayScore: match.Away?.Score || null,
      stage: match.StageName?.[0]?.Description || '',
      group: match.GroupName?.[0]?.Description || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    throw error;
  }
}

function getMatchStatus(status: number): string {
  console.log('Convertendo status:', status);
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