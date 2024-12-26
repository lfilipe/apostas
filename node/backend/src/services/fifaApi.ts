import axios from 'axios';

export async function getFifaMatches(competitionId: string, seasonId: string) {
  try {
    const response = await axios.get(`https://api.fifa.com/api/v3/calendar/matches?count=100&idCompetition=${competitionId}&idSeason=${seasonId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar partidas da FIFA:', error);
    throw error;
  }
} 