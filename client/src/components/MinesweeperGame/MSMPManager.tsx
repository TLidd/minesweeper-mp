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
    let [opponentReady, setOpponentReady] = useState<boolean>(false);

    //tracking who's turn it is (server will initialize)
    let [currentPlayerTurn, setCurrentPlayerTurn] = useState<string | null>(null);

    let params = useParams();

    const tileClicked = (x: number, y: number) => {

    }

    const PlayerIsReady = () => {
        socket.emit('playerIsReady', params.gameID);
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

        //when the opponent readies, let this player know
        function playerReadied(playerID: string): void{
            if(opponent === playerID) setOpponentReady(true);
        }
        socket.on('playerReadied', playerReadied);

        //connect to the lobby/room (fill game data)
        socket.emit('lobbyConnect', params.gameID);

        return () => {
            socket.off('initialBoard', getInitialBoard);
            socket.off('playerReadied', playerReadied);
        }
    }, [params, opponent])

  return (
    <div>
        {!boardState && <InvitePlayers linkCopy={`${process.env.REACT_APP_SERVER}/game/${params.gameID}`}/>}
        {boardState &&
            <div className='game-container'>
                <div className='item'>
                    <Player player1={true} playerReady={PlayerIsReady} isOpponent={false}/>
                </div>
                <div className='item'>
                    {boardState && <TiledBoard currentBoard={boardState} currentPlayerTurn={socket.id === currentPlayerTurn} tileClickedCallback={tileClicked}/>}
                </div>
                <div className='item'>
                    <Player player1={false} playerReady={PlayerIsReady} isOpponent={true} isReady={opponentReady}/>
                </div>
            </div>
        }
    </div>
  )
}
