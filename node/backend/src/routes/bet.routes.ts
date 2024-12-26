import { Router, RequestHandler } from 'express';
import { BetController } from '../controllers/BetController';
import { authMiddleware } from '../middlewares/authMiddleware';

const betRouter = Router();
const betController = new BetController();

// Todas as rotas de apostas requerem autenticação
betRouter.use(authMiddleware);

const create: RequestHandler = betController.create.bind(betController);
const list: RequestHandler = betController.list.bind(betController);
const calculateResults: RequestHandler = betController.calculateResults.bind(betController);

betRouter.post('/', create);
betRouter.get('/', list);
betRouter.post('/calculate/:matchId', calculateResults);

export { betRouter }; 