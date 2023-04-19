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
    //creates the game based on the specifications the player selected.
    socket.on('createGame', (boardSize: number, numOfBombs: number, timer: number) => {
        if(!minesweeperGamesList.gameExists(socket.id)){
            let millis = (timer * 60) * 1000
            let newGame = new msMPTimed(boardSize, numOfBombs, millis);
    
            minesweeperGamesList.addGame(socket.id, newGame);

            io.to(socket.id).emit('createdGame', socket.id);
        }
    })

    //connects the two players to the lobby and loads the initial board.
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

    //readies or unreadies the player and if both players are ready it starts the game.
    socket.on('playerIsReady', (gameID) => {
        if(io.sockets.adapter.rooms.get(gameID)){
            if(io.sockets.adapter.rooms.get(gameID).size == 2){
                let game = minesweeperGamesList.getGame(gameID);
                if(game){
                    let playerReady = game.playerReady(socket.id);
                    if(game.getPlayersReady()){
                        io.to(gameID).emit('startGame', game.getGameInfo());
                    } else {
                        io.to(gameID).emit('playerReadied', socket.id, playerReady);
                    }
                }
            }
        }
    })

    socket.on('makeMove', (gameID, x, y) => {
        if(io.sockets.adapter.rooms.get(gameID)){
            let game = minesweeperGamesList.getGame(gameID);
            game.makeMove({x, y}, socket.id);

            let gameInfo = game.getGameInfo()
            io.to(gameID).emit('getMoveMade', gameInfo);

            //if the board is cleared then select the loser based on the time each player has left.
            if(game.clearedBoard()){
                let losingPlayer: string;
                if(gameInfo.player1Time > gameInfo.player2Time){
                    losingPlayer = gameInfo.player2;
                } else {
                    losingPlayer = gameInfo.player1;
                }
                io.to(gameID).emit('playerLost', losingPlayer);
            }
        }
    })

    socket.on('playerLost', (gameID) => {
        if(io.sockets.adapter.rooms.get(gameID)){
            io.to(gameID).emit('playerLost', socket.id);
        }
    })

    socket.on('resetGame', (gameID) => {
        if(io.sockets.adapter.rooms.get(gameID)){

            let game = minesweeperGamesList.getGame(gameID);
            let buildInfo = game.getBuildInfo();

            let newGame = new msMPTimed(buildInfo.length, buildInfo.bombs, buildInfo.time);
            newGame.setPlayer(buildInfo.p1);
            newGame.setPlayer(buildInfo.p2);

            minesweeperGamesList.addGame(gameID, newGame);
            io.to(gameID).emit('cleanBoard');
            io.to(gameID).emit('initialBoard', minesweeperGamesList.getCurrentGameInfo(gameID));
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