import '../../styles/MinesweeperGame/GameEnd.css'

interface GameEndProps{
    win: boolean;
    restartCallback: () => void;
}

export default function GameEnd({win, restartCallback}: GameEndProps) {
  return (
    <div id='game-end-container'>
        <div>{win ? 'You Lost' : 'You Win'}</div>
        <button id='game-end-button' onClick={restartCallback}>New Game</button>
    </div>
  )
}
