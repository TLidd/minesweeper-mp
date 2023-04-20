"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minesweeper_1 = __importDefault(require("./minesweeper"));
class msMultiplayer extends minesweeper_1.default {
    constructor(length, bombs) {
        super(length, bombs);
        this.player1Ready = false;
        this.player2Ready = false;
        this.gameStart = false;
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
    /**
     *
     * @param player set player1 or player2 if player1 set
     *
     */
    setPlayer(player) {
        if (player != this.player1 && player != this.player2) {
            if (this.player1) {
                this.player2 = player;
                return;
            }
            this.player1 = player;
        }
    }
    unsetPlayer(player) {
        if (player == this.player1)
            this.player1 = undefined;
        else if (player == this.player2)
            this.player2 = undefined;
    }
    getGameInfo() {
        let currentBoard = this.getCurrentBoard();
        let game = {
            board: currentBoard,
            player1: this.player1,
            player2: this.player2,
        };
        if (this.gameStart)
            game.playerTurn = this.playerTurn;
        if (this.losingPlayer)
            game.playerLost = this.losingPlayer;
        return game;
    }
    /**
     *
     * @param playerID takes in a player
     * @returns whether the player is ready or not
     */
    playerReady(playerID) {
        if (this.player1 == playerID) {
            if (this.player1Ready) {
                this.player1Ready = false;
                return false;
            }
            else {
                this.player1Ready = true;
                return true;
            }
        }
        else {
            if (this.player2Ready) {
                this.player2Ready = false;
                return false;
            }
            else {
                this.player2Ready = true;
                return true;
            }
        }
    }
    /**
     * sets the playerTurn to player1 on game start
     * @returns true if players are ready or false if both players aren't ready
     */
    getPlayersReady() {
        if (this.player1Ready && this.player2Ready) {
            this.gameStart = true;
            this.playerTurn = this.player1;
            return true;
        }
        return false;
    }
    /**
     *
     * @returns true if both players are registered to the lobby/game
     */
    playersLoaded() {
        if (this.player1) {
            if (this.player2) {
                return true;
            }
        }
    }
    /**
     * debug print
     */
    printInfo() {
        let msg = `Game info:
        size: ${this.length} x ${this.length},
        #ofBombs: ${this.bombs},
        player1: ${this.player1},
        player2: ${this.player2},
        playerTurn: ${this.playerTurn}`;
        console.log(msg);
    }
}
exports.default = msMultiplayer;
//# sourceMappingURL=msMultiplayer.js.map