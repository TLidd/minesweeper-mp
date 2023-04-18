import Tile from './Tile';
import { useEffect, useState } from 'react';
import '../../styles/MinesweeperGame/GameBoard.css';
import { socket } from '../../socket';
import { useParams } from 'react-router-dom';
import Player1 from './Player1';
import Player2 from './Player2';

type timers = {
  p1: {
      player: string;
      timeRemaining: number
  }
  p2: {
      player: string;
      timeRemaining: number
  }
}

export default function GameBoard() {
  let [gameStart, setGameStart] = useState<boolean>(false);

  let [gameState, setGameState] = useState<Array<Array<number>> | null>();
  let [currentTurn, setCurrentTurn] = useState<boolean>(false);
  let [playerLost, setPlayerLost] = useState<string | null>(null);

  let [playerTimers, setPlayerTimers] = useState<timers | null>(null);

  let params = useParams();

  const tileClickedCallback = (x: number, y: number) => {
    socket.emit('makeMove', x, y, params.gameID);
    setCurrentTurn(false);
  }

  const timeExpired = () => {
    socket.emit('playerLost');
  }

  const setPlayerReady = () => {
    socket.emit('readyPlayer', params.gameID);
  }

  useEffect(() => {
    if(playerLost) setGameStart(false);

    function moveMade(gameBoardInfo: { board: Array<Array<number>>, playerTurn: string, playerTimers: timers, playerLost?: string }) {
      setGameState(gameBoardInfo.board);
      setPlayerTimers(gameBoardInfo.playerTimers);
      if (gameBoardInfo.playerLost) setPlayerLost(gameBoardInfo.playerLost);
      if (socket.id === gameBoardInfo.playerTurn) setCurrentTurn(true);
      if (gameBoardInfo.playerLost){
        setPlayerLost(gameBoardInfo.playerLost);
        setCurrentTurn(false);
      }
    }

    function receiveGameBoard(gameBoardInfo: { board: Array<Array<number>>, playerTurn: string, playerTimers: timers }): void {
      setGameState(gameBoardInfo.board);
      setPlayerTimers(gameBoardInfo.playerTimers);
      if (socket.id === gameBoardInfo.playerTurn) setCurrentTurn(true);
    }

    function receivePlayerLost(playerID: string){
      setPlayerLost(playerID);
    }

    function gameStart(startPlayerID: string){
      if(socket.id == startPlayerID) setCurrentTurn(true);
      setGameStart(true);
    }

    socket.emit('requestGameBoard', params.gameID);

    socket.on('moveMade', moveMade);

    socket.on('receiveGameBoard', receiveGameBoard);

    socket.on('receievePlayerLost', receivePlayerLost);

    socket.on('gameStart', gameStart);

    return () => {
      socket.off('moveMade', moveMade);
      socket.off('receiveGameBoard', receiveGameBoard);
    }
  }, [params.gameID, playerLost])

  return (
    <div className='minesweeper-game-mp'>
      {playerTimers && <Player1 remainingTime={playerTimers?.p1.player === socket.id ? playerTimers?.p1.timeRemaining : playerTimers?.p2.timeRemaining} playerTurn={currentTurn} playerLost={timeExpired} playerReady={setPlayerReady} gameStart={gameStart}/>}
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
      {playerTimers && <Player2 remainingTime={playerTimers?.p1.player === socket.id ? playerTimers?.p1.timeRemaining : playerTimers?.p2.timeRemaining} playerTurn={!currentTurn} playerLost={timeExpired} gameStart={gameStart}/>}
    </div>
  )
}