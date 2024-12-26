import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { CompetitionService } from '../services/CompetitionService';

export class CompetitionController {
  private competitionService: CompetitionService;

  constructor() {
    this.competitionService = new CompetitionService();
  }

  list = async (req: Request, res: Response) => {
    try {
      const competitions = await prisma.competition.findMany({
        include: {
          _count: {
            select: { matches: true }
          }
        }
      });

      return res.json(competitions);
    } catch (error) {
      console.error('Erro ao listar competições:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const competition = await prisma.competition.findUnique({
        where: { id },
        include: {
          matches: {
            include: {
              odds: true,
              bets: {
                where: { userId: req.userId }
              }
            }
          }
        }
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competição não encontrada' });
      }

      return res.json(competition);
    } catch (error) {
      console.error('Erro ao buscar competição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { externalId, name, startDate, endDate } = req.body;

      const existingCompetition = await prisma.competition.findUnique({
        where: { externalId }
      });

      if (existingCompetition) {
        return res.status(400).json({ error: 'Competição já existe' });
      }

      const competition = await prisma.competition.create({
        data: {
          externalId,
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: true
        }
      });

      return res.status(201).json(competition);
    } catch (error) {
      console.error('Erro ao criar competição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, startDate, endDate, isActive } = req.body;

      const competition = await prisma.competition.findUnique({
        where: { id }
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competição não encontrada' });
      }

      const updatedCompetition = await prisma.competition.update({
        where: { id },
        data: {
          name,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          isActive
        }
      });

      return res.json(updatedCompetition);
    } catch (error) {
      console.error('Erro ao atualizar competição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const competition = await prisma.competition.findUnique({
        where: { id }
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competição não encontrada' });
      }

      await prisma.competition.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar competição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  syncMatches = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const competition = await prisma.competition.findUnique({
        where: { id }
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competição não encontrada' });
      }

      const matches = await this.competitionService.syncMatches(competition);

      return res.json(matches);
    } catch (error) {
      console.error('Erro ao sincronizar jogos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
} 