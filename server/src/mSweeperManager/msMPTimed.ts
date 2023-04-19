import msMultiplayer, { gameInfo } from "./msMultiplayer";

export interface msGameInfo extends gameInfo{
    player1Time: number;
    player2Time: number;
}

export default class msMPTimed extends msMultiplayer{
    private timer1: number = 300000;
    private timer2: number = 300000;

    private initialTime: number;

    timerInterval = setInterval(() => {
        if(this.playerTurn){
            if(this.playerTurn == this.player1){
                this.timer1 -= 1000;
            }else{
                this.timer2 -= 1000;
            }
        }
    }, 1000)

    /**
     * 
     * @param length the size of the board length x length
     * @param bombs the number of placed bombs
     * @param timer1 player1 timer in millis
     * @param timer2 player2 timer in millis
     */
    constructor(length: number, bombs: number, timer: number){
        super(length, bombs);
        if(timer){
            this.timer1 = timer;
            this.timer2 = timer;
            this.initialTime = timer;
        }
    }

    public makeMove(coordinates: { x: number, y: number }, player: string): void{
        if(player == this.playerTurn) this.revealTiles({x: coordinates.x, y: coordinates.y});

        if(this.getPlayerLost()){
            this.losingPlayer = this.playerTurn;
        }

        if(player == this.player1) this.playerTurn = this.player2;
        else this.playerTurn = this.player1;
    }

    public getGameInfo(): msGameInfo {
        let currentBoard = this.getCurrentBoard();
        let game: msGameInfo = {
            board: currentBoard,
            player1: this.player1,
            player2: this.player2,
            player1Time: this.timer1,
            player2Time: this.timer2
        }

        if(this.gameStart) game.playerTurn = this.playerTurn;
        if(this.losingPlayer) game.playerLost = this.losingPlayer;

        return game;
    }

    public getBuildInfo(): {
        p1: string,
        p2: string,
        time: number,
        length: number,
        bombs: number
    } {
        return {
            p1: this.player1,
            p2: this.player2,
            time: this.initialTime,
            length: this.length,
            bombs: this.bombs,
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
        player1TimeRemaning: ${this.timer1},
        player2TimeRemaining: ${this.timer2},
        player2: ${this.player2},
        playerTurn: ${this.playerTurn}`;

        console.log(msg);
    }
}