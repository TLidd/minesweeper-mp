import '../../styles/MinesweeperGame/PlayerTimer.css'

export default function PlayerTimer({timeRemaining} : {timeRemaining: number}) {
    let mins: number = Math.floor(timeRemaining / 60000);
    let seconds: number = Number(((timeRemaining % 60000) / 1000).toFixed(0));
  return (
    <div id='player-timer'>
        {mins+ ":" + (seconds < 10 ? '0' : '') + seconds}
    </div>
  )
}

PlayerTimer.defaultProps = {
    timeRemaining: 290000,
}
