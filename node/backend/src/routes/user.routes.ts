import { Router, Request, Response } from 'express';

const userRouter = Router();

userRouter.get('/me', async (req: Request, res: Response) => {
  // TODO: Implementar perfil do usuário
  res.json({ message: 'Perfil do usuário' });
});

userRouter.get('/ranking', async (req: Request, res: Response) => {
  // TODO: Implementar ranking
  res.json({ message: 'Ranking de usuários' });
});

userRouter.get('/', async (req: Request, res: Response) => {
  // TODO: Implementar listagem
  res.json({ message: 'Lista de usuários' });
});

export { userRouter }; 