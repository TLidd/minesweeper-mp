import '../../styles/MinesweeperGame/Player.css'
import PlayerReady from './PlayerReady';

interface PlayerProps{
    player1: boolean;
    playerReady: () => void;
    isOpponent: boolean;
    isReady?: boolean;
}

/**
 * 
 * @param player1 both players are on the left hand side
 * 
 */
export default function Player({player1, playerReady, isOpponent, isReady}: PlayerProps) {
    let playerTag: string = player1 ? 'YOU' : 'OPPONENT'
  return (
    <div id='player-container'>
        <div id='player-tag'>{playerTag}</div>
        <PlayerReady readyCallback={playerReady} isOpponent={isOpponent} isReady={isReady}/>
    </div>
  )
}
