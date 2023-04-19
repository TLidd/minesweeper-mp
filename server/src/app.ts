import { createServer } from "http";
import { Server, Socket } from 'socket.io';
import express, { Express } from "express";
import cors from 'cors';

import { minesweeperGamesList } from './mSweeperManager/gamesManager';
import msMPTimed from './mSweeperManager/msMPTimed';

const PORT = process.env.PORT || 4000;

const app: Express = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {cors: {origin: 'http://localhost:3000'}});

io.on('connection', (socket: Socket) => {
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

    //a quick disconnect feature that just lets the user know the opponent disconnected.
    socket.on('disconnecting', () => {
        for(let roomID of socket.rooms){
            if(minesweeperGamesList.gameExists(roomID)){
                minesweeperGamesList.deleteGame(roomID);
                io.to(roomID).emit('opponentDisconnected');
            }
        }
    })
})

server.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));