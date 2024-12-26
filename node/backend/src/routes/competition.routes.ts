import { Router, Request, Response } from 'express';

const competitionRouter = Router();

competitionRouter.get('/', async (req: Request, res: Response) => {
  // TODO: Implementar listagem
  res.json({ message: 'Listagem de competições' });
});

competitionRouter.get('/:id', async (req: Request, res: Response) => {
  // TODO: Implementar detalhes
  res.json({ message: 'Detalhes da competição' });
});

export { competitionRouter }; 