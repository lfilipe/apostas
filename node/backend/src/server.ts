import express, { Request, Response } from 'express';
import cors from 'cors';
import { getFifaMatches } from './services/fifaApi';
import { authRouter } from './routes/auth.routes';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.get('/matches', async (req: Request, res: Response) => {
  try {
    const matches = await getFifaMatches('289175', '10005');
    res.json(matches);
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 