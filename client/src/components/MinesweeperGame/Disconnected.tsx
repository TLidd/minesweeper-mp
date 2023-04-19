import '../../styles/MinesweeperGame/Disconnected.css'

export default function Disconnected() {
  return (
    <div id='disconnected-container'>
        <div id='disconnected-msg'>Opponent has disconnected</div>
        <a href="/" id='disconnected'>Return to Main Menu</a>
    </div>
  )
}
