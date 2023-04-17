import MineSweeperGame from "./minesweeper";

export default class msMultiplayer extends MineSweeperGame{
    protected player1: string;
    protected player2: string;

    protected playerTurn: string;
    protected losingPlayer: string;

    constructor(length: number, bombs: number){
        super(length, bombs);
    }

    public makeMove(coordinates: { x: number, y: number }, player: string): void{
        if(player == this.playerTurn) this.revealTiles({x: coordinates.x, y: coordinates.y});

        if(this.getPlayerLost()){
            this.losingPlayer = this.playerTurn;
        }

        if(player == this.player1) this.playerTurn = this.player2;
        else this.playerTurn = this.player1;
    }

    /**
     * 
     * @param player set player1 or player2 if player1 set
     * 
     */
    public setPlayer(player: string): void{
        if(!this.playerTurn) this.playerTurn = player;

        if(player != this.player1 && player != this.player2){
            if(this.player1){
                this.player2 = player;
                return;
            }
            
            this.player1 = player;
        }
    }

    /**
     * 
     * @returns the board that reveals the selected tiles from the client
     */
    public getRevealBoard(): {board: Array<Array<number>>, playerTurn: string, playerLost?: string} {
        if(this.losingPlayer){
            let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn, playerLost: this.losingPlayer};
            return boardInfo;
        }
        
        let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn};
        return boardInfo;
    }


    /**
     * debug print
     */
    public printInfo(): void {
        let msg: string = `Game info:
        size: ${this.length} x ${this.length},
        #ofBombs: ${this.bombs},
        player1: ${this.player1},
        player2: ${this.player2},
        playerTurn: ${this.playerTurn}`;

        console.log(msg);
    }
}