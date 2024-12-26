import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/jwt';

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Verifica se o token está presente
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Extrai o token do header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      // Verifica e decodifica o token
      const decoded = verifyToken(token);
      
      // Busca o usuário no banco
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub }
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Verifica se o usuário é admin
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      // Adiciona o usuário ao request para uso posterior
      req.user = user;
      
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 