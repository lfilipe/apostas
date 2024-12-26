import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class MatchController {
  list = async (req: Request, res: Response) => {
    try {
      const { competitionId } = req.query;

      const matches = await prisma.match.findMany({
        where: competitionId ? { competitionId: String(competitionId) } : undefined,
        include: {
          odds: true,
          bets: {
            where: { userId: req.userId }
          }
        },
        orderBy: {
          matchDateTime: 'asc'
        }
      });

      return res.json(matches);
    } catch (error) {
      console.error('Erro ao listar jogos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          odds: true,
          bets: {
            where: { userId: req.userId }
          }
        }
      });

      if (!match) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }

      return res.json(match);
    } catch (error) {
      console.error('Erro ao buscar jogo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  updateOdds = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { homeWinOdd, drawOdd, awayWinOdd } = req.body;

      const match = await prisma.match.findUnique({
        where: { id },
        include: { odds: true }
      });

      if (!match) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }

      if (match.status !== 'SCHEDULED') {
        return res.status(400).json({ error: 'Não é possível atualizar odds de um jogo em andamento ou finalizado' });
      }

      const odds = await prisma.bettingOdd.upsert({
        where: {
          matchId: id
        },
        update: {
          homeWinOdd,
          drawOdd,
          awayWinOdd,
          updatedBy: req.userId
        },
        create: {
          matchId: id,
          homeWinOdd,
          drawOdd,
          awayWinOdd,
          createdBy: req.userId
        }
      });

      return res.json(odds);
    } catch (error) {
      console.error('Erro ao atualizar odds:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  updateScore = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { homeScore, awayScore, status } = req.body;

      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          bets: true
        }
      });

      if (!match) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }

      // Atualiza o jogo
      const updatedMatch = await prisma.match.update({
        where: { id },
        data: {
          homeScore,
          awayScore,
          status
        }
      });

      // Se o jogo foi finalizado, calcula os pontos das apostas
      if (status === 'FINISHED') {
        await Promise.all(
          match.bets.map(async (bet: { id: string; userId: string; homeTeamScore: number; awayTeamScore: number; points: number }) => {
            let points = 0;
            const isMatchedResult = bet.homeTeamScore === homeScore && bet.awayTeamScore === awayScore;

            // Pontuação:
            // - Placar exato: 10 pontos
            // - Acertou o vencedor ou empate: 5 pontos
            if (isMatchedResult) {
              points = 10;
            } else {
              const betResult = Math.sign(bet.homeTeamScore - bet.awayTeamScore);
              const matchResult = Math.sign(homeScore - awayScore);
              if (betResult === matchResult) {
                points = 5;
              }
            }

            // Atualiza a aposta
            await prisma.bet.update({
              where: { id: bet.id },
              data: {
                points,
                isMatchedResult
              }
            });

            // Atualiza a pontuação total do usuário
            await prisma.user.update({
              where: { id: bet.userId },
              data: {
                totalPoints: {
                  increment: points
                }
              }
            });
          })
        );
      }

      return res.json(updatedMatch);
    } catch (error) {
      console.error('Erro ao atualizar placar:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
} 