import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FifaService } from '../../services/fifa.service';
import { Competition } from '../../models';

@Component({
  selector: 'app-competitions',
  template: `
    <div class="container">
      <header class="section">
        <h1 class="heading">Competições</h1>
        <p class="subtitle">Escolha uma competição para ver os jogos disponíveis</p>
      </header>

      <main>
        <div class="loading" *ngIf="loading">
          <div class="spinner"></div>
          <p>Carregando competições...</p>
        </div>

        <div class="error" *ngIf="error">
          <p>{{error}}</p>
          <button class="btn btn-outline" (click)="reload()">
            Tentar novamente
          </button>
        </div>

        <div class="competitions-grid" *ngIf="!loading && !error">
          <div *ngFor="let competition of competitions" 
               class="competition-card"
               (click)="navigateToMatches(competition)">
            <div class="competition-image">
              <img [src]="getCompetitionImage(competition)" [alt]="competition.name">
            </div>
            <div class="competition-content">
              <h3>{{competition.name}}</h3>
              <span class="badge" [class.active]="competition.isActive">
                {{competition.isActive ? 'Em andamento' : 'Finalizado'}}
              </span>
              <button class="btn btn-primary">
                Ver Jogos
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .subtitle {
      color: var(--app-text-secondary);
      margin-top: var(--space-2);
    }

    .competitions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    .competition-card {
      background: var(--app-surface);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      }
    }

    .competition-image {
      height: 160px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .competition-content {
      padding: var(--space-4);

      h3 {
        margin: 0 0 var(--space-2);
        font-size: 1.25rem;
        color: var(--app-text);
      }
    }

    .badge {
      display: inline-block;
      padding: var(--space-1) var(--space-2);
      border-radius: 99px;
      font-size: 0.75rem;
      background: var(--app-surface-light);
      color: var(--app-text-secondary);
      margin-bottom: var(--space-4);

      &.active {
        background: var(--app-success);
        color: white;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class CompetitionsComponent implements OnInit {
  competitions: Competition[] = [];
  loading = false;
  error = '';

  constructor(
    private fifaService: FifaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    console.log('Carregando competições...');

    this.fifaService.getFifaCompetition('289175', '10005').subscribe({
      next: (competition) => {
        console.log('Competição carregada:', competition);
        this.competitions = [competition];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar:', error);
        this.error = 'Erro ao carregar competições';
        this.loading = false;
      }
    });
  }

  navigateToMatches(competition: Competition) {
    console.log('Navegando para:', competition);
    this.router.navigate(['/competition', competition.idSeason, competition.idCompetition]);
  }

  getCompetitionImage(competition: Competition): string {
    // Usando imagens do Unsplash como placeholder
    const images = [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018'
    ];
    
    return images[Math.floor(Math.random() * images.length)] + '?w=600&h=320&fit=crop';
  }

  reload() {
    this.ngOnInit();
  }
} 