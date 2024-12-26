import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class UserController {
  me = async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: {
          bets: {
            include: {
              match: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  ranking = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          totalPoints: 'desc'
        },
        select: {
          id: true,
          name: true,
          totalPoints: true,
          _count: {
            select: {
              bets: true
            }
          }
        }
      });

      return res.json(users);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          name: 'asc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          totalPoints: true,
          createdAt: true,
          _count: {
            select: {
              bets: true
            }
          }
        }
      });

      return res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
} 