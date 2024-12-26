import { Router, Request, Response } from 'express';

const matchRouter = Router();

matchRouter.get('/', async (req: Request, res: Response) => {
  // TODO: Implementar listagem
  res.json({ message: 'Listagem de partidas' });
});

matchRouter.get('/:id', async (req: Request, res: Response) => {
  // TODO: Implementar detalhes
  res.json({ message: 'Detalhes da partida' });
});

export { matchRouter }; 