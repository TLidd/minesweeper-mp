import MineSweeperGame from "./minesweeper";

export interface gameInfo{
    board: any;
    player1: string;
    player2: string;
    playerTurn?: string;
    playerLost?: string;
}

export default class msMultiplayer extends MineSweeperGame{
    protected player1: string;
    protected player2: string;

    protected playerTurn: string;
    protected losingPlayer: string;

    protected player1Ready: boolean = false;
    protected player2Ready: boolean = false;

    protected gameStart: boolean = false;

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
        if(player != this.player1 && player != this.player2){
            if(this.player1){
                this.player2 = player;
                return;
            }
            
            this.player1 = player;
        }
    }

    public getGameInfo(): gameInfo {
        let currentBoard = this.getCurrentBoard();
        let game: gameInfo= {
            board: currentBoard,
            player1: this.player1,
            player2: this.player2,
        }

        if(this.gameStart) game.playerTurn = this.playerTurn;
        if(this.losingPlayer) game.playerLost = this.losingPlayer;

        return game;
    }

    // public getRevealBoard(): {board: Array<Array<number>>, playerTurn: string, playerLost?: string} {
    //     if(this.losingPlayer){
    //         let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn, playerLost: this.losingPlayer};
    //         return boardInfo;
    //     }

    //     let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn};
    //     return boardInfo;
    // }

    /**
     * 
     * @param playerID takes in a player 
     * @returns whether the player is ready or not
     */
    public playerReady(playerID: string): boolean{
        if(this.player1 == playerID){
            if(this.player1Ready){
                this.player1Ready = false;
                return false;
            } else {
                this.player1Ready = true;
                return true;
            }
        } else {
            if(this.player2Ready){
                this.player2Ready = false;
                return false;
            } else {
                this.player2Ready = true;
                return true;
            }
        }
    }

    /**
     * sets the playerTurn to player1 on game start
     * @returns true if players are ready or false if both players aren't ready
     */
    public getPlayersReady(): boolean{
        if(this.player1Ready && this.player2Ready){
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
    public playersLoaded(): boolean{
        if(this.player1){
            if(this.player2){
                return true;
            }
        }
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