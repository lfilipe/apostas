import { prisma } from '../lib/prisma';

export class BetService {
  async createOrUpdateBet(userId: string, matchId: string, homeTeamScore: number, awayTeamScore: number) {
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      throw new Error('Partida não encontrada');
    }

    if (match.status !== 'SCHEDULED') {
      throw new Error('Não é possível apostar em uma partida que já começou ou terminou');
    }

    // Busca aposta existente
    const existingBet = await prisma.bet.findFirst({
      where: {
        userId,
        matchId
      }
    });

    if (existingBet) {
      // Atualiza aposta existente
      return prisma.bet.update({
        where: { id: existingBet.id },
        data: {
          homeTeamScore,
          awayTeamScore
        }
      });
    }

    // Cria nova aposta
    return prisma.bet.create({
      data: {
        userId,
        matchId,
        homeTeamScore,
        awayTeamScore
      }
    });
  }

  async getUserBets(userId: string) {
    return prisma.bet.findMany({
      where: {
        userId
      },
      include: {
        match: {
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async calculateMatchResults(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match || match.status !== 'FINISHED' || match.homeTeamScore === null || match.awayTeamScore === null) {
      throw new Error('Partida não finalizada ou sem resultado definido');
    }

    // Busca todas as apostas confirmadas desta partida
    const bets = await prisma.bet.findMany({
      where: {
        matchId
      }
    });

    // Atualiza os pontos e status de cada aposta
    const updatePromises = bets.map(bet => {
      const isExactScore = bet.homeTeamScore === match.homeTeamScore && 
                          bet.awayTeamScore === match.awayTeamScore;
      const isCorrectResult = 
        (bet.homeTeamScore > bet.awayTeamScore && match.homeTeamScore! > match.awayTeamScore!) ||
        (bet.homeTeamScore < bet.awayTeamScore && match.homeTeamScore! < match.awayTeamScore!) ||
        (bet.homeTeamScore === bet.awayTeamScore && match.homeTeamScore! === match.awayTeamScore!);

      let points = 0;
      if (isExactScore) {
        points = 25; // Pontuação máxima para placar exato
      } else if (isCorrectResult) {
        points = 10; // Pontuação para acertar apenas o resultado
      }

      return prisma.bet.update({
        where: { id: bet.id },
        data: {
          points,
          user: {
            update: {
              totalPoints: {
                increment: points
              }
            }
          }
        }
      });
    });

    await Promise.all(updatePromises);
  }
} 