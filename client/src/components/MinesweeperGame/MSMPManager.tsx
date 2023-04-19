import { socket } from '../../socket';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InvitePlayers from './InvitePlayers';
import TiledBoard from './TiledBoard';
import Player from './Player';

import '../../styles/MinesweeperGame/MSMPManager.css';
import GameEnd from './GameEnd';

export default function MSMPManager() {
    //the current board state with the covered tiles.
    let [boardState, setBoardState] = useState<Array<Array<number>> | null>();

    //this player can use socket.id to identify, opponent will be initialized by server.
    let [opponent, setOpponent] = useState<string | null>();
    let [opponentReady, setOpponentReady] = useState<boolean>(false);

    let [playerReady, setPlayerReady] = useState<boolean>(false);

    let [timeLeft, setTimeLeft] = useState<number>(0);
    let [opponentTimeLeft, setOpponentTimeLeft] = useState<number>(0);

    //tracking who's turn it is (server will initialize)
    let [currentPlayerTurn, setCurrentPlayerTurn] = useState<string | null>(null);

    let [playerLost, setPlayerLost] = useState<string | null>(null);

    let params = useParams();

    const tileClicked = (x: number, y: number) => {
        socket.emit('makeMove', params.gameID, x, y);
    }

    const PlayerIsReady = () => {
        setPlayerReady(true);
        socket.emit('playerIsReady', params.gameID);
    }

    const PlayerLost = () => {
        socket.emit('playerLost', params.gameID);
    }

    const newGame = () => {
        socket.emit('resetGame', params.gameID);
    }

    useEffect(() => {
        //get the initial board state and player info.
        function getInitialBoard(gameInfo: any): void{
            //get the initial covered board state
            setBoardState(() => {
                let newBoard = gameInfo.board;
                return newBoard;
            });

            //set the players opponent
            if(socket.id === gameInfo.player1) setOpponent(gameInfo.player2);
            else setOpponent(gameInfo.player1);

            //set the players times
            if(socket.id === gameInfo.player1){
                setTimeLeft(gameInfo.player1Time);
                setOpponentTimeLeft(gameInfo.player2Time);
            } else {
                setTimeLeft(gameInfo.player2Time);
                setOpponentTimeLeft(gameInfo.player1Time);
            }

            //resetting these variables if the game is reset.
            setCurrentPlayerTurn(null);
            setPlayerLost(null);
            setOpponentReady(false);
            setPlayerReady(false);
        }
        socket.on('initialBoard', getInitialBoard);

        //shows this player that their opponent readied up or unreadied.
        function playerReadied(playerID: string, isReady: boolean): void{
            if(opponent === playerID){
                setOpponentReady(isReady);
            }
        }
        socket.on('playerReadied', playerReadied);

        function playerLost(playerID: string): void{
            setPlayerLost(playerID);
        }
        socket.on('playerLost', playerLost);

        function startGame(gameInfo: any){
            setCurrentPlayerTurn(gameInfo.playerTurn);
        }
        socket.on('startGame', startGame);

        //when the move is relayed from the server update the game information.
        function getMoveMade(gameInfo: any){
            setCurrentPlayerTurn(gameInfo.playerTurn);
            if(gameInfo.playerLost) setPlayerLost(gameInfo.playerLost);

            //set the players times
            if(socket.id === gameInfo.player1){
                setTimeLeft(gameInfo.player1Time);
                setOpponentTimeLeft(gameInfo.player2Time);
            } else {
                setTimeLeft(gameInfo.player2Time);
                setOpponentTimeLeft(gameInfo.player1Time);
            }

            setBoardState(gameInfo.board);

            if(gameInfo.playerLost) setPlayerLost(gameInfo.playerLost);
        }
        socket.on('getMoveMade', getMoveMade);

        //connect to the lobby/room (fill game data)
        socket.emit('lobbyConnect', params.gameID);

        return () => {
            socket.off('initialBoard', getInitialBoard);
            socket.off('playerReadied', playerReadied);
            socket.off('startGame', startGame);
            socket.off('playerLost', playerLost);
            socket.off('getMoveMade', getMoveMade);
        }
    }, [params, opponent])

  return (
    <div>
        {!boardState && <InvitePlayers linkCopy={`${process.env.REACT_APP_SERVER}/game/${params.gameID}`}/>}
        {boardState &&
            <div className={`game-container ${playerLost ? 'game-over' : ''}`}>
                <div className='item'>
                    <Player player1={true} setPlayerReady={PlayerIsReady} isOpponent={false} isReady={playerReady} playerLost={PlayerLost} playerTurn={playerLost === null && socket.id === currentPlayerTurn} timeLeft={timeLeft} gameStarted={currentPlayerTurn ? true : false} setTime={setTimeLeft}/>
                </div>
                <div className='item'>
                    {boardState && <TiledBoard currentBoard={boardState} currentPlayerTurn={socket.id === currentPlayerTurn} tileClickedCallback={tileClicked}/>}
                </div>
                <div className='item'>
                    <Player player1={false} setPlayerReady={PlayerIsReady} isOpponent={true} isReady={opponentReady} playerLost={PlayerLost} playerTurn={playerLost === null && opponent === currentPlayerTurn} timeLeft={opponentTimeLeft} gameStarted={currentPlayerTurn ? true : false} setTime={setOpponentTimeLeft}/>
                </div>
            </div>
        }
        {
            playerLost && 
            <GameEnd win={playerLost === socket.id} restartCallback={newGame}/>
        }
    </div>
  )
}
