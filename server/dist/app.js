"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gamesManager_1 = require("./mSweeperManager/gamesManager");
const msMPTimed_1 = __importDefault(require("./mSweeperManager/msMPTimed"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, { cors: { origin: 'http://localhost:3000' } });
io.on('connection', (socket) => {
    //creates the game based on the specifications the player selected.
    socket.on('createGame', (boardSize, numOfBombs, timer) => {
        if (!gamesManager_1.minesweeperGamesList.gameExists(socket.id)) {
            let millis = (timer * 60) * 1000;
            let newGame = new msMPTimed_1.default(boardSize, numOfBombs, millis);
            gamesManager_1.minesweeperGamesList.addGame(socket.id, newGame);
            io.to(socket.id).emit('createdGame', socket.id);
        }
    });
    //connects the two players to the lobby and loads the initial board.
    socket.on('lobbyConnect', (gameID) => {
        if (io.sockets.adapter.rooms.get(gameID)) {
            if (io.sockets.adapter.rooms.get(gameID).size <= 2) {
                socket.join(gameID);
                let game = gamesManager_1.minesweeperGamesList.getGame(gameID);
                if (game) {
                    game.setPlayer(socket.id);
                    if (game.playersLoaded())
                        io.to(gameID).emit('initialBoard', gamesManager_1.minesweeperGamesList.getCurrentGameInfo(gameID));
                }
                else {
                    //need to handle the no game exists state.
                    console.log("Lobby/Game does not exist");
                }
            }
        }
    });
    //readies or unreadies the player and if both players are ready it starts the game.
    socket.on('playerIsReady', (gameID) => {
        if (io.sockets.adapter.rooms.get(gameID)) {
            if (io.sockets.adapter.rooms.get(gameID).size == 2) {
                let game = gamesManager_1.minesweeperGamesList.getGame(gameID);
                if (game) {
                    let playerReady = game.playerReady(socket.id);
                    if (game.getPlayersReady()) {
                        io.to(gameID).emit('startGame', game.getGameInfo());
                    }
                    else {
                        io.to(gameID).emit('playerReadied', socket.id, playerReady);
                    }
                }
            }
        }
    });
    socket.on('makeMove', (gameID, x, y) => {
        if (io.sockets.adapter.rooms.get(gameID)) {
            let game = gamesManager_1.minesweeperGamesList.getGame(gameID);
            game.makeMove({ x, y }, socket.id);
            let gameInfo = game.getGameInfo();
            io.to(gameID).emit('getMoveMade', gameInfo);
            //if the board is cleared then select the loser based on the time each player has left.
            if (game.clearedBoard()) {
                let losingPlayer;
                if (gameInfo.player1Time > gameInfo.player2Time) {
                    losingPlayer = gameInfo.player2;
                }
                else {
                    losingPlayer = gameInfo.player1;
                }
                io.to(gameID).emit('playerLost', losingPlayer);
            }
        }
    });
    socket.on('playerLost', (gameID) => {
        if (io.sockets.adapter.rooms.get(gameID)) {
            io.to(gameID).emit('playerLost', socket.id);
        }
    });
    socket.on('resetGame', (gameID) => {
        if (io.sockets.adapter.rooms.get(gameID)) {
            let game = gamesManager_1.minesweeperGamesList.getGame(gameID);
            let buildInfo = game.getBuildInfo();
            let newGame = new msMPTimed_1.default(buildInfo.length, buildInfo.bombs, buildInfo.time);
            newGame.setPlayer(buildInfo.p1);
            newGame.setPlayer(buildInfo.p2);
            gamesManager_1.minesweeperGamesList.addGame(gameID, newGame);
            io.to(gameID).emit('cleanBoard');
            io.to(gameID).emit('initialBoard', gamesManager_1.minesweeperGamesList.getCurrentGameInfo(gameID));
        }
    });
    //a quick disconnect feature that just lets the user know the opponent disconnected.
    socket.on('disconnecting', () => {
        for (let roomID of socket.rooms) {
            if (gamesManager_1.minesweeperGamesList.gameExists(roomID)) {
                gamesManager_1.minesweeperGamesList.deleteGame(roomID);
                io.to(roomID).emit('opponentDisconnected');
            }
        }
    });
});
server.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
//# sourceMappingURL=app.js.map