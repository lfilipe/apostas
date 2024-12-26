import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class AdminController {
  async dashboard(req: Request, res: Response) {
    try {
      // Busca totais
      const [
        totalUsers,
        totalMatches,
        totalCompetitions,
        totalBets,
        recentBets,
        upcomingMatches
      ] = await Promise.all([
        // Total de usuários
        prisma.user.count(),
        
        // Total de partidas
        prisma.match.count(),
        
        // Total de competições
        prisma.competition.count(),
        
        // Total de apostas
        prisma.bet.count(),
        
        // Apostas recentes com usuário e partida
        prisma.bet.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true
              }
            },
            match: {
              select: {
                homeTeamName: true,
                awayTeamName: true,
                homeTeamScore: true,
                awayTeamScore: true
              }
            }
          }
        }),

        // Próximas partidas com contagem de apostas
        prisma.match.findMany({
          where: {
            matchDateTime: {
              gte: new Date()
            }
          },
          take: 5,
          orderBy: { matchDateTime: 'asc' },
          include: {
            _count: {
              select: { bets: true }
            }
          }
        })
      ]);

      // Formata os dados das apostas recentes
      const formattedRecentBets = recentBets.map(bet => ({
        id: bet.id,
        user: {
          name: bet.user.name
        },
        match: {
          homeTeam: bet.match.homeTeamName,
          awayTeam: bet.match.awayTeamName,
          homeScore: bet.match.homeTeamScore,
          awayScore: bet.match.awayTeamScore
        },
        points: bet.points
      }));

      // Formata os dados das próximas partidas
      const formattedUpcomingMatches = upcomingMatches.map(match => ({
        id: match.id,
        homeTeam: match.homeTeamName,
        awayTeam: match.awayTeamName,
        matchDateTime: match.matchDateTime.toISOString(),
        totalBets: match._count.bets
      }));

      return res.json({
        totalUsers,
        totalMatches,
        totalCompetitions,
        totalBets,
        recentBets: formattedRecentBets,
        upcomingMatches: formattedUpcomingMatches
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 