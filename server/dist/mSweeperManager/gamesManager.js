"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minesweeperGamesList = void 0;
class gameManager {
    constructor() {
        this.gameList = {};
    }
    addGame(gameID, game) {
        this.gameList[gameID] = game;
    }
    deleteGame(gameID) {
        delete this.gameList[gameID];
    }
    /**
     *
     * @param gameID
     * @returns the game info that shows the current board and player info.
     */
    getCurrentGameInfo(gameID) {
        return this.gameList[gameID].getGameInfo();
    }
    getGame(gameID) {
        return this.gameList[gameID];
    }
    displayGames(games) {
        if (!games) {
            Object.keys(this.gameList).map(gameID => {
                console.log(`Game ID: ${gameID}`);
                this.gameList[gameID].printInfo();
            });
        }
    }
    gameExists(gameID) {
        return this.gameList[gameID] ? true : false;
    }
}
let minesweeperGamesList = new gameManager();
exports.minesweeperGamesList = minesweeperGamesList;
//# sourceMappingURL=gamesManager.js.map