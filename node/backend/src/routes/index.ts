import { Router } from 'express';
import { userRouter } from './user.routes';
import { betRouter } from './bet.routes';
import { matchRouter } from './match.routes';
import { competitionRouter } from './competition.routes';
import { adminRouter } from './admin.routes';

const router = Router();

router.use('/users', userRouter);
router.use('/bets', betRouter);
router.use('/matches', matchRouter);
router.use('/competitions', competitionRouter);
router.use('/admin', adminRouter);

export { router }; 