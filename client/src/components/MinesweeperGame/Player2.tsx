import ReadiedUP from "./ReadiedUp";
import PlayerTimer from "./PlayerTimer";
import '../../styles/MinesweeperGame/Player.css'

export default function Player2({remainingTime, playerTurn, playerLost, gameStart}: 
    {remainingTime: number, playerTurn: boolean, playerLost: () => void, gameStart: boolean}){
    return (
        <div id="player-box">
            <PlayerTimer timeRemaining={remainingTime} runTimer={playerTurn} lostCallback={playerLost} gameStarted={gameStart}/>
            <div>Waiting on player...</div>
        </div>
    )
}