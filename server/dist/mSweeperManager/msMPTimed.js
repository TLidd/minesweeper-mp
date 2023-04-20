"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const msMultiplayer_1 = __importDefault(require("./msMultiplayer"));
class msMPTimed extends msMultiplayer_1.default {
    /**
     *
     * @param length the size of the board length x length
     * @param bombs the number of placed bombs
     * @param timer1 player1 timer in millis
     * @param timer2 player2 timer in millis
     */
    constructor(length, bombs, timer) {
        super(length, bombs);
        this.timer1 = 300000;
        this.timer2 = 300000;
        this.timerInterval = setInterval(() => {
            if (this.playerTurn) {
                if (this.playerTurn == this.player1) {
                    this.timer1 -= 1000;
                }
                else {
                    this.timer2 -= 1000;
                }
            }
        }, 1000);
        if (timer) {
            this.timer1 = timer;
            this.timer2 = timer;
            this.initialTime = timer;
        }
    }
    makeMove(coordinates, player) {
        if (player == this.playerTurn)
            this.revealTiles({ x: coordinates.x, y: coordinates.y });
        if (this.getPlayerLost()) {
            this.losingPlayer = this.playerTurn;
        }
        if (player == this.player1)
            this.playerTurn = this.player2;
        else
            this.playerTurn = this.player1;
    }
    getGameInfo() {
        let currentBoard = this.getCurrentBoard();
        let game = {
            board: currentBoard,
            player1: this.player1,
            player2: this.player2,
            player1Time: this.timer1,
            player2Time: this.timer2
        };
        if (this.gameStart)
            game.playerTurn = this.playerTurn;
        if (this.losingPlayer)
            game.playerLost = this.losingPlayer;
        return game;
    }
    getBuildInfo() {
        return {
            p1: this.player1,
            p2: this.player2,
            time: this.initialTime,
            length: this.length,
            bombs: this.bombs,
        };
    }
    /**
     * debug print
     */
    printInfo() {
        let msg = `Game info:
        size: ${this.length} x ${this.length},
        #ofBombs: ${this.bombs},
        player1: ${this.player1},
        player1TimeRemaning: ${this.timer1},
        player2TimeRemaining: ${this.timer2},
        player2: ${this.player2},
        playerTurn: ${this.playerTurn}`;
        console.log(msg);
    }
}
exports.default = msMPTimed;
//# sourceMappingURL=msMPTimed.js.map