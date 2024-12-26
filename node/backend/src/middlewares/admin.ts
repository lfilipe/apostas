import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const superAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userRole } = req;

  if (!userRole || userRole !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  return next();
}; 