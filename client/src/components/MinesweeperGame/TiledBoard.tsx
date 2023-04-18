import Tile from "./Tile";
import '../../styles/TiledBoard.css'

interface TiledBoardProps{
    currentBoard: any;
    tileClickedCallback: (x: number, y: number) => void;
    currentPlayerTurn: boolean;
}

export default function TiledBoard({currentBoard, tileClickedCallback, currentPlayerTurn}: TiledBoardProps) {
  return (
    <div id='tiled-board'>
        <div id='tiled-board-row'>
            {
            currentBoard.map((x: Array<number>, xIndex: number) => {
                return (
                <div key={xIndex}>
                    {
                    x.map((tile: number, yIndex) => {
                        return <Tile x={xIndex} y={yIndex} tileMarker={tile} clickedCallback={tileClickedCallback} currentTurn={currentPlayerTurn} key={xIndex + ' ' + yIndex} />
                    })
                    }
                </div>
                )
            })
            }
        </div>
    </div>
  )
}
