import Tile from './Tile';
import { useEffect, useState } from 'react';
import '../styles/GameBoard.css';
import { socket } from '../socket';
import { useParams } from 'react-router-dom';

export default function GameBoard() {
  let [gameState, setGameState] = useState<Array<Array<number>> | null>();

  let params = useParams();

  const tileClickedCallback = (x: number, y: number) => {
    socket.emit('makeMove', x, y, params.gameID);
  }

  useEffect(() => {
    // let abortController = new AbortController();
    // let signal = abortController.signal;

    //getGameState();

    function moveMade(gameBoard: Array<Array<number>>){
      setGameState(gameBoard);
    }

    function receiveGameBoard(board: Array<Array<number>>){
      setGameState(board);
    }

    socket.emit('requestGameBoard', params.gameID);

    socket.on('moveMade', moveMade);

    socket.on('receiveGameBoard', receiveGameBoard);

    return () => {
      socket.off('moveMade', moveMade);
      socket.off('receiveGameBoard', receiveGameBoard);
      socket.off('requestGameBoard');
    }
  }, [])

  // const getGameState = async (signal?: AbortSignal) => {
  //   const res = await fetch(`/getBoard?gameID=${params.gameID}`, { signal });
  //   const data = await res.json();
  //   setGameState(data);
  // }

  return (
    <div className='board'>
      <div>
        {
          gameState?.map((x: Array<number>, xIndex: number) => {
            return (
              <div className='grid' key={xIndex}>
                {
                  x.map((tile: number, yIndex) => {
                    return <Tile x={xIndex} y={yIndex} tileMarker={tile} clickedCallback={tileClickedCallback} key={xIndex + ' ' + yIndex} />
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