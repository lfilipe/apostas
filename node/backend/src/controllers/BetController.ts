import { Request, Response } from 'express';
import { BetService } from '../services/BetService';

export class BetController {
  private betService: BetService;

  constructor() {
    this.betService = new BetService();
  }

  async create(req: Request, res: Response) {
    try {
      const { id: userId } = req.user!;
      const { matchId, homeTeamScore, awayTeamScore } = req.body;

      const bet = await this.betService.createOrUpdateBet(
        userId,
        matchId,
        homeTeamScore,
        awayTeamScore
      );

      res.status(201).json(bet);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async calculateResults(req: Request, res: Response) {
    try {
      const { matchId } = req.params;

      await this.betService.calculateMatchResults(matchId);

      res.json({ message: 'Resultados calculados com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { id: userId } = req.user!;

      const bets = await this.betService.getUserBets(userId);

      res.json(bets);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
} 