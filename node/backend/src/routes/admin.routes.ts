import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from '../controllers/AdminController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.use((req: Request, res: Response, next: NextFunction) => {
  adminMiddleware(req, res, next);
});

adminRouter.get('/dashboard', (req: Request, res: Response) => {
  adminController.dashboard(req, res);
});

export { adminRouter }; 