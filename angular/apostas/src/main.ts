import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

const routes = [
  { 
    path: '', 
    redirectTo: '/competitions', 
    pathMatch: 'full' as const 
  },
  { 
    path: 'competitions', 
    loadComponent: () => import('./app/components/competitions/competitions.component')
      .then(m => m.CompetitionsComponent) 
  },
  { 
    path: 'competition/:idSeason/:idCompetition', 
    loadComponent: () => import('./app/components/betting/betting.component')
      .then(m => m.BettingComponent) 
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
