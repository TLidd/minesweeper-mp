import msMultiplayer from "./msMultiplayer";

export default class msMPTimed extends msMultiplayer{
    private timer1: number = 300000;
    private timer2: number = 300000;

    private currentTime = new Date().getTime();

    constructor(length: number, bombs: number, timer1?: number, timer2?: number){
        super(length, bombs);
        if(timer1 && timer2){
            this.timer1 = timer1;
            this.timer2 = timer2;
        }
    }

    public makeMove(coordinates: { x: number, y: number }, player: string): void{
        if(player == this.playerTurn) this.revealTiles({x: coordinates.x, y: coordinates.y});

        this.manageTimers();

        if(this.getPlayerLost()){
            this.losingPlayer = this.playerTurn;
        }

        if(player == this.player1) this.playerTurn = this.player2;
        else this.playerTurn = this.player1;
    }

    private manageTimers(){
        let endTime = new Date().getTime();
        let timeDiff = endTime - this.currentTime;

        if(this.player1 == this.playerTurn){
            this.timer1 = this.timer1 - timeDiff;
            if(this.timer1 <= 0) this.losingPlayer = this.player1;
        } 
        else {
            this.timer2 = this.timer2 - timeDiff;
            if(this.timer2 <= 0) this.losingPlayer = this.player2;
        }

        this.currentTime = endTime;
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