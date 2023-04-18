import '../../styles/MinesweeperGame/Player.css'
import PlayerReady from './PlayerReady';
import PlayerTimer from './PlayerTimer';

interface PlayerProps{
    player1: boolean;
    playerReady: () => void;
    isOpponent: boolean;
    isReady?: boolean;
    timeLeft: number;
    playerTurn: boolean;
    playerLost: () => void;
}

/**
 * 
 * @param player1 both players are on the left hand side
 * 
 */
export default function Player({player1, playerReady, isOpponent, isReady, timeLeft, playerTurn, playerLost}: PlayerProps) {
    let playerTag: string = player1 ? 'YOU' : 'OPPONENT'
  return (
    <div id='player-container'>
        <div>
            <div id='player-tag'>{playerTag}</div>
            <PlayerTimer timeRemaining={timeLeft} runTimer={playerTurn} lostCallback={playerLost} isOpponent={isOpponent}/>
        </div>
        <PlayerReady readyCallback={playerReady} isOpponent={isOpponent} isReady={isReady}/>
    </div>
  )
}
