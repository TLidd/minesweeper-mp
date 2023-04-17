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
        io.to(id).emit('moveMade', minesweeperGamesList.getBoard(id));
    })

    socket.on('requestGameBoard', (gameID: string) => {
        if(io.sockets.adapter.rooms.get(gameID).size <= 2){
            socket.join(gameID);
            if(minesweeperGamesList.gameExists(gameID.toString())){
                minesweeperGamesList.getGame(gameID).setPlayer(socket.id);
                io.to(gameID).emit('receiveGameBoard', minesweeperGamesList.getBoard(gameID.toString()));
            } else {
                console.log("game does not exist");
            }
        }else{
            console.log("Too many players");
        }
    })

    socket.on('disconnecting', () => {
        for(let i of socket.rooms){
            minesweeperGamesList.deleteGame(i);
        }
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