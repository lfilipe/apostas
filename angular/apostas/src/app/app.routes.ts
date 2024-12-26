import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/competitions', 
    pathMatch: 'full' 
  },
  { 
    path: 'competitions', 
    loadComponent: () => import('./components/competitions/competitions.component')
      .then(m => m.CompetitionsComponent) 
  },
  { 
    path: 'competition/:idSeason/:idCompetition', 
    loadComponent: () => import('./components/betting/betting.component')
      .then(m => m.BettingComponent) 
  }
]; 