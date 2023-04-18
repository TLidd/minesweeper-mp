import { socket } from '../../socket';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InvitePlayers from './InvitePlayers';
import TiledBoard from './TiledBoard';
import Player from './Player';

import '../../styles/MinesweeperGame/MSMPManager.css';

export default function MSMPManager() {
    //the current board state with the covered tiles.
    let [boardState, setBoardState] = useState<Array<Array<number>> | null>();

    //this player can use socket.id to identify, opponent will be initialized by server.
    let [opponent, setOpponent] = useState<string | null>();

    //tracking who's turn it is (server will initialize)
    let [currentPlayerTurn, setCurrentPlayerTurn] = useState<string | null>(null);

    let params = useParams();

    const tileClicked = (x: number, y: number) => {

    }

    useEffect(() => {
        //get the initial board state and player info.
        function getInitialBoard(gameInfo: any): void{
            //get the initial covered board state
            setBoardState(gameInfo.board.board);

            //set the players opponent
            if(socket.id === gameInfo.player1) setOpponent(gameInfo.player2);
            else setOpponent(gameInfo.player1);
        }
        socket.on('initialBoard', getInitialBoard);

        //connect to the lobby/room (fill game data)
        socket.emit('lobbyConnect', params.gameID);

        return () => {
            socket.off('initialBoard', getInitialBoard);
        }
    }, [])

  return (
    <div>
        {!boardState && <InvitePlayers linkCopy={`${process.env.REACT_APP_SERVER}/game/${params.gameID}`}/>}
        <div className='game-container'>
            <div className='item'>
                <Player player1={true}/>
            </div>
            <div className='item'>
                {boardState && <TiledBoard currentBoard={boardState} currentPlayerTurn={socket.id == currentPlayerTurn} tileClickedCallback={tileClicked}/>}
            </div>
            <div className='item'>
                <Player player1={false}/>
            </div>
        </div>
    </div>
  )
}
