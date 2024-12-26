import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  // TODO: Implementar registro
  res.json({ message: 'Registro' });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  // TODO: Implementar login
  res.json({ message: 'Login' });
});

export { authRouter }; 