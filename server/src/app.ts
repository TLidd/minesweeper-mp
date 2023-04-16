import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';

const app: Express = express();
const PORT = 4000;

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', socket => {
    console.log(socket.id);
})

app.get('/api', async (req: Request, res: Response) => {
  res.json({
    message: 'Hello React',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});