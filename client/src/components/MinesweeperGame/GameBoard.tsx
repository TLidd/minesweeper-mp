import Tile from './Tile';
import { useEffect, useState } from 'react';
import '../../styles/MinesweeperGame/GameBoard.css';
import { socket } from '../../socket';
import { useParams } from 'react-router-dom';
import Player from './Player';

export default function GameBoard() {
  let [gameState, setGameState] = useState<Array<Array<number>> | null>();
  let [currentTurn, setCurrentTurn] = useState<boolean>(false);
  let [playerLost, setPlayerLost] = useState<string | null>(null);

  let params = useParams();

  const tileClickedCallback = (x: number, y: number) => {
    socket.emit('makeMove', x, y, params.gameID);
    setCurrentTurn(false);
  }

  useEffect(() => {

    function moveMade(gameBoardInfo: { board: Array<Array<number>>, playerTurn: string, playerLost?: string }) {
      setGameState(gameBoardInfo.board);
      if (gameBoardInfo.playerLost) setPlayerLost(gameBoardInfo.playerLost);
      if (socket.id === gameBoardInfo.playerTurn) setCurrentTurn(true);
      if (gameBoardInfo.playerLost){
        setPlayerLost(gameBoardInfo.playerLost);
        setCurrentTurn(false);
      }
    }

    function receiveGameBoard(gameBoardInfo: { board: Array<Array<number>>, playerTurn: string }): void {
      setGameState(gameBoardInfo.board);
      if (socket.id === gameBoardInfo.playerTurn) setCurrentTurn(true);
    }

    socket.emit('requestGameBoard', params.gameID);

    socket.on('moveMade', moveMade);

    socket.on('receiveGameBoard', receiveGameBoard);

    return () => {
      socket.off('moveMade', moveMade);
      socket.off('receiveGameBoard', receiveGameBoard);
    }
  }, [params.gameID])

  return (
    <div className='minesweeper-game-mp'>
      <Player />
      <div className='board'>
        {
          gameState?.map((x: Array<number>, xIndex: number) => {
            return (
              <div className= {playerLost !== null ? 'blur-grid' : ''} key={xIndex}>
                {
                  x.map((tile: number, yIndex) => {
                    return <Tile x={xIndex} y={yIndex} tileMarker={tile} clickedCallback={tileClickedCallback} currentTurn={currentTurn} key={xIndex + ' ' + yIndex} />
                  })
                }
              </div>
            )
          })
        }
        {
          playerLost !== null &&
          <div className='gameFinish'>
            {
              socket.id === playerLost ? <b>YOU LOSE!</b> : <b>YOU WIN!</b>
            }
          </div>
        }
      </div>
      <Player />
    </div>
  )
}