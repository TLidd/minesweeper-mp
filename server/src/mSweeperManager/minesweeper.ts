export default class MineSweeperGame {
    private bombs: number = 10;
    private length: number = 10;

    private board: Array<Array<number>> = [];

    //The grid representing the board with the covered tiles.
    private coveredBoard: Array<Array<number>> = [];

    /**
     * 
     * @param length the length of the n x n grid
     * @param bombs the number of bombs on the grid
     */
    constructor(length: number, bombs: number) {
        if (length != undefined) this.length = length;
        if (bombs != undefined) this.bombs = bombs;

        if (bombs > length * length) {
            throw new Error("More bombs than board space");
        }

        this.createBoard();
    }

    public printInfo(): void {
        let msg: string = `Game info:
        size: ${this.length} x ${this.length}
        #ofBombs: ${this.bombs}`;

        console.log(msg);
    }

    /**
     * creates the board for the minesweeper game and populates it with bombs
     */
    private createBoard(): void {
        for (let i = 0; i < this.length; i++) {
            let row: Array<number> = Array(this.length).fill(0);
            this.board.push(row);

            /*pushing array of zeroes to represent whether the board tile is covered
            (0 -> covered tile, 1 -> revealed tile) */
            let coveredRow: Array<number> = Array(this.length).fill(-2);
            this.coveredBoard.push(coveredRow);
        }

        this.setBombs();
    }

    /**
     * sets the bombs on the grid
     */
    private setBombs(): void {
        for (let i = 0; i < this.bombs; i++) {
            let x = Math.floor(Math.random() * this.length);
            let y = Math.floor(Math.random() * this.length);

            while (this.board[x][y] == -1) {
                x = Math.floor(Math.random() * this.length);
                y = Math.floor(Math.random() * this.length);
            }

            this.board[x][y] = -1;

            if (x - 1 >= 0 && this.board[x - 1][y] != -1) this.board[x - 1][y] += 1;
            if (x + 1 < this.length && this.board[x + 1][y] != -1) this.board[x + 1][y] += 1;
            if (y - 1 >= 0 && this.board[x][y - 1] != -1) this.board[x][y - 1] += 1;
            if (y + 1 < this.length && this.board[x][y + 1] != -1) this.board[x][y + 1] += 1;

            if (x + 1 < this.length && y + 1 < this.length && this.board[x + 1][y + 1] != -1) this.board[x + 1][y + 1] += 1;
            if (x + 1 < this.length && y - 1 >= 0 && this.board[x + 1][y - 1] != -1) this.board[x + 1][y - 1] += 1;
            if (x - 1 >= 0 && y + 1 < this.length && this.board[x - 1][y + 1] != -1) this.board[x - 1][y + 1] += 1;
            if (x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1] != -1) this.board[x - 1][y - 1] += 1;

        }
    }

    /**
     * 
     * @param coordinates takes in a coordinate pair to find the tile clicked
     * @returns the tile number
     */
    public revealTiles(coordinates: { x: number, y: number }) {
        this.coveredBoard[coordinates.x][coordinates.y] = this.board[coordinates.x][coordinates.y];
        if (this.board[coordinates.x][coordinates.y] == 0) {
            for (let i = coordinates.x - 1; i <= coordinates.x + 1; i++) {
                for (let j = coordinates.y - 1; j <= coordinates.y + 1; j++) {
                    if (i >= 0 && i < this.length && j >= 0 && j < this.length && this.coveredBoard[i][j] == -2) {
                        this.revealTiles({ x: i, y: j });
                    }
                }
            }
        }
    }

    public getRevealBoard(): Array<Array<number>> {
        return this.coveredBoard;
    }
}