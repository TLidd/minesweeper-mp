import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';

import { minesweeperGamesList } from './mSweeperManager/gamesManager';
import MineSweeperGame from './mSweeperManager/minesweeper';

const app: Express = express();
const PORT = 4000;

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', socket => {
    socket.on('makeMove', (x: number, y: number, id: string) => {
        minesweeperGamesList.getGame(id).revealTiles({x, y});
        io.emit('moveMade', minesweeperGamesList.getBoard(id));
    })

    socket.on('disconnect', () => {
        minesweeperGamesList.deleteGame(socket.id);
    })
})


app.get('/createGame', async (req: Request, res: Response) => {
    const {gameID, boardSize, numOfBombs} = req.query;

    if(!minesweeperGamesList.gameExists(gameID.toString())){
        // console.log("\nCreating new game...");
        let newGame = new MineSweeperGame(Number(boardSize), Number(numOfBombs));

        minesweeperGamesList.addGame(gameID.toString(), newGame);
        // minesweeperGamesList.displayGames();
    }

    res.end();
});

app.get('/getBoard', async (req: Request, res: Response) => {
    const {gameID} = req.query;
    if(minesweeperGamesList.gameExists(gameID.toString())){
        // console.log(`serving game: ${gameID}`);
        res.json(minesweeperGamesList.getBoard(gameID.toString()));
    } else {
        console.log("game does not exist");
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});