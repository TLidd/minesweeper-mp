import MineSweeperGame from "./minesweeper";

class gameManager {
    private gameList: Record<string, MineSweeperGame> = {};

    public addGame(gameID: string, game: MineSweeperGame): void {
        this.gameList[gameID] = game;
    }

    public deleteGame(gameID: string): void {
        delete this.gameList[gameID];
    }

    public getGame(gameID: string): MineSweeperGame {
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