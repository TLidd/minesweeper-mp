import ReadiedUP from "./ReadiedUp";
import PlayerTimer from "./PlayerTimer";
import '../../styles/MinesweeperGame/Player.css'

export default function Player1({remainingTime, playerTurn, playerLost, playerReady, gameStart}:
     {remainingTime: number, playerTurn: boolean,  playerLost: () => void, playerReady: () => void, gameStart: boolean}){
    return (
        <div id="player-box">
            <PlayerTimer timeRemaining={remainingTime} runTimer={playerTurn} lostCallback={playerLost} gameStarted={gameStart}/>
            <ReadiedUP readyCallback={playerReady} gameStarted={gameStart}/>
        </div>
    )
}