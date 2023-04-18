import msMultiplayer from "./msMultiplayer";

type timers = {
    p1: {
        player: string;
        timeRemaining: number;
    }
    p2: {
        player: string;
        timeRemaining: number;
    }
}

export default class msMPTimed extends msMultiplayer{
    private timer1: number = 300000;
    private timer2: number = 300000;

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


    /**
     * 
     * @returns the board that reveals the selected tiles from the client
     */
    public getRevealBoard(): {board: Array<Array<number>>, playerTurn: string, playerTimers: timers, playerLost?: string} {
        let playerTimes: timers = {p1: {player: this.player1, timeRemaining: this.timer1}, p2: {player: this.player2, timeRemaining: this.timer2}}
        if(this.losingPlayer){
            let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn, playerTimers: playerTimes, playerLost: this.losingPlayer};
            return boardInfo;
        }
        
        let boardInfo = {board: this.coveredBoard, playerTurn: this.playerTurn, playerTimers: playerTimes};
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
        player1TimeRemaning: ${this.timer1},
        player2TimeRemaining: ${this.timer2},
        player2: ${this.player2},
        playerTurn: ${this.playerTurn}`;

        console.log(msg);
    }
}