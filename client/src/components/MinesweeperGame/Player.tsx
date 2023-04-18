import '../../styles/MinesweeperGame/Player.css'

interface PlayerProps{
    player1: boolean;
}

/**
 * 
 * @param player1 both players are on the left hand side
 * 
 */
export default function Player({player1}: PlayerProps) {
    let playerTag: string = player1 ? 'YOU' : 'OPPONENT'
  return (
    <div id='player-tag'>{playerTag}</div>
  )
}
