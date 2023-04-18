// import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';

import { minesweeperGamesList } from './mSweeperManager/gamesManager';
import msMPTimed from './mSweeperManager/msMPTimed';

// const app: Express = express();
// const PORT = 4000;

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', socket => {
    socket.on('createGame', (boardSize: number, numOfBombs: number, timer: number) => {
        if(!minesweeperGamesList.gameExists(socket.id)){
            let millis = (timer * 60) * 1000
            let newGame = new msMPTimed(boardSize, numOfBombs, millis);
    
            minesweeperGamesList.addGame(socket.id, newGame);

            io.to(socket.id).emit('createdGame', socket.id);
        }
    })

    socket.on('lobbyConnect', (gameID) => {
        if(io.sockets.adapter.rooms.get(gameID)){
            if(io.sockets.adapter.rooms.get(gameID).size <= 2){
                socket.join(gameID);
                let game = minesweeperGamesList.getGame(gameID);
                if(game){
                    game.setPlayer(socket.id);
                    if(game.playersLoaded()) io.to(gameID).emit('initialBoard', minesweeperGamesList.getCurrentGameInfo(gameID));
                }else{
                    //need to handle the no game exists state.
                    console.log("Lobby/Game does not exist");
                }
            }
        }
    })

    socket.on('playerIsReady', (gameID) => {
        if(io.sockets.adapter.rooms.get(gameID)){
            if(io.sockets.adapter.rooms.get(gameID).size == 2){
                let game = minesweeperGamesList.getGame(gameID);
                if(game){
                    game.playerReady(socket.id);
                    if(game.getPlayersReady()){
                        io.emit('startGame', game.getGameInfo());
                    } else {
                        io.emit('playerReadied', socket.id);
                    }
                }
            }
        }
    })

    // socket.on('makeMove', (x: number, y: number, gameID: string) => {
    //     minesweeperGamesList.getGame(gameID).makeMove({x, y}, socket.id);
    //     io.to(gameID).emit('moveMade', minesweeperGamesList.getBoard(gameID));
    // })

    // socket.on('requestGameBoard', (gameID: string) => {
    //     if(io.sockets.adapter.rooms.get(gameID)){
    //         if(io.sockets.adapter.rooms.get(gameID).size <= 2){
    //             socket.join(gameID);
    //             if(minesweeperGamesList.gameExists(gameID)){
    //                 minesweeperGamesList.getGame(gameID).setPlayer(socket.id);
    //                 io.to(gameID).emit('receiveGameBoard', minesweeperGamesList.getBoard(gameID));
    //             } else {
    //                 console.log("game does not exist");
    //             }
    //         }else{
    //             console.log("Too many players");
    //         }
    //     }
    // })

    // socket.on('playerLost', (gameID) => {
    //     io.to(gameID).emit(socket.id);
    // })

    // socket.on('readyPlayer', (gameID) => {
    //     let game = minesweeperGamesList.getGame(gameID)
    //     let startPlayer = game.playerReady(socket.id);
    //     if(startPlayer) io.emit('gameStart', startPlayer);
    // })

    // //currently deletes game if anyone leaves the lobby
    // socket.on('disconnecting', () => {
    //     for(let i of socket.rooms){
    //         minesweeperGamesList.deleteGame(i);
    //     }
    // })
})


// app.get('/createGame', async (req: Request, res: Response) => {
//     const {gameID, boardSize, numOfBombs} = req.query;

//     if(!minesweeperGamesList.gameExists(gameID.toString())){
//         // console.log("\nCreating new game...");
//         let newGame = new msMPTimed(Number(boardSize), Number(numOfBombs));

//         minesweeperGamesList.addGame(gameID.toString(), newGame);
//         // minesweeperGamesList.displayGames();
//     }

//     res.end();
// });

// app.get('/getBoard', async (req: Request, res: Response) => {
//     const {gameID} = req.query;
//     if(minesweeperGamesList.gameExists(gameID.toString())){
//         // console.log(`serving game: ${gameID}`);
//         res.json(minesweeperGamesList.getBoard(gameID.toString()));
//     } else {
//         console.log("game does not exist");
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });