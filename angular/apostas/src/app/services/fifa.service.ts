import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { 
  Competition, 
  Match, 
  MatchOdds,
  FifaCompetitionResponse,
  FifaMatchesResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FifaService {
  private readonly API_URL = 'https://api.fifa.com/api/v3';

  constructor(private http: HttpClient) {}

  getFifaCompetition(idSeason: string, idCompetition: string): Observable<Competition> {
    const url = `${this.API_URL}/seasons/${idCompetition}/${idSeason}?language=pt`;
    console.log('Fetching competition:', url);

    return this.http.get<FifaCompetitionResponse>(url).pipe(
      tap(response => console.log('Raw API response:', response)),
      map(response => ({
        id: response.Properties.Ident,
        name: response.Name[0],
        idSeason: response.IdSeason,
        idCompetition: response.IdCompetition,
        position: 1,
        isActive: response.Properties.IsActive
      })),
      tap(mappedResponse => console.log('Mapped competition:', mappedResponse))
    );
  }

  private formatPictureUrl(url: string): string {
    return url?.replace('{format}-{size}', 'sq-2') || '';
  }

  private generateOdds(): MatchOdds {
    // Gera odds aleatórias realistas
    const homeOdd = Number((1 + Math.random() * 3).toFixed(2));
    const drawOdd = Number((2.5 + Math.random() * 2).toFixed(2));
    const awayOdd = Number((1 + Math.random() * 3).toFixed(2));
    
    return {
      home: homeOdd,
      draw: drawOdd,
      away: awayOdd
    };
  }

  private getMatchStatus(status: number): string {
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

  getFifaMatches(idSeason: string, idCompetition: string): Observable<Match[]> {
    const url = `${this.API_URL}/calendar/matches?idSeason=${idSeason}&idCompetition=${idCompetition}&language=pt&count=500`;
    console.log('Fetching matches:', url);

    return this.http.get<FifaMatchesResponse>(url).pipe(
      tap(response => console.log('Raw matches response:', response)),
      map(response => (response.Results || []).map((match: FifaMatchesResponse['Results'][0]) => {
        const status = this.getMatchStatus(Number(match.MatchStatus));
        return {
          idMatch: match.IdMatch || '',
          idSeason: idSeason,
          competitionId: match.IdCompetition || '',
          matchDateTime: new Date(match.Date || new Date()),
          status,
          homeTeamId: match.Home?.IdTeam || '',
          homeTeamName: match.Home?.TeamName?.[0]?.Description || 'Time Casa',
          homeTeamScore: match.Home?.Score,
          homeTeamPicture: this.formatPictureUrl(match.Home?.PictureUrl),
          awayTeamId: match.Away?.IdTeam || '',
          awayTeamName: match.Away?.TeamName?.[0]?.Description || 'Time Visitante',
          awayTeamScore: match.Away?.Score,
          awayTeamPicture: this.formatPictureUrl(match.Away?.PictureUrl),
          odds: status === 'SCHEDULED' ? this.generateOdds() : undefined
        };
      })),
      tap(mappedMatches => console.log('Mapped matches:', mappedMatches))
    );
  }
} 