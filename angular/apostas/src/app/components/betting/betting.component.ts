import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FifaService } from '../../services/fifa.service';
import { Competition, Match } from '../../models';

@Component({
  selector: 'app-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.scss'],
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule]
})
export class BettingComponent implements OnInit {
  competition?: Competition;
  matches: Match[] = [];
  loading = false;
  error = '';
  teamFilter: string = '';
  selectedOdd: 'home' | 'draw' | 'away' | null = null;

  constructor(
    private fifaService: FifaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const { idSeason, idCompetition } = params;
      this.loadCompetitionData(idSeason, idCompetition);
    });
  }

  private loadCompetitionData(idSeason: string, idCompetition: string) {
    this.loading = true;
    this.fifaService.getFifaCompetition(idSeason, idCompetition).subscribe({
      next: (competition) => {
        this.competition = competition;
        this.loadMatches(idSeason, idCompetition);
      },
      error: (error) => {
        this.error = 'Erro ao carregar competição';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  private loadMatches(idSeason: string, idCompetition: string) {
    this.fifaService.getFifaMatches(idSeason, idCompetition).subscribe({
      next: (matches) => {
        this.matches = matches;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar jogos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getTeamFlag(teamId: string): string {
    return `https://api.fifa.com/api/v3/picture/teams-sq-2/${teamId}`; 
  }

  getMatchStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Agendado',
      'LIVE': 'Ao Vivo',
      'FINISHED': 'Finalizado',
      'POSTPONED': 'Adiado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  reload() {
    const { idSeason, idCompetition } = this.route.snapshot.params;
    this.loadCompetitionData(idSeason, idCompetition);
  }

  selectOdd(type: 'home' | 'draw' | 'away'): void {
    this.selectedOdd = type;
  }
} 