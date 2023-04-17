import msMPTimed from "./msMPTimed";


class gameManager {
    private gameList: Record<string, msMPTimed> = {};

    public addGame(gameID: string, game: msMPTimed): void {
        this.gameList[gameID] = game;
    }

    public deleteGame(gameID: string): void {
        delete this.gameList[gameID];
    }

    /**
     * 
     * @param gameID 
     * @returns the game board that shows the revealed tiles.
     */
    public getBoard(gameID: string): {board: Array<Array<number>>, playerTurn: string} {
        return this.gameList[gameID].getRevealBoard();
    }

    public getGame(gameID: string): msMPTimed {
        return this.gameList[gameID];
    }

    public displayGames(games?: Array<string>): void {
        if (!games) {
            Object.keys(this.gameList).map(gameID => {
                console.log(`Game ID: ${gameID}`);
                this.gameList[gameID].printInfo();
            })
        }
    }

    public gameExists(gameID: string): boolean{
        return this.gameList[gameID] ? true : false;
    }

}

let minesweeperGamesList: gameManager = new gameManager();
export { minesweeperGamesList }