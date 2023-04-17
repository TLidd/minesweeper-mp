import ReadiedUP from "./ReadiedUp";
import PlayerTimer from "./PlayerTimer";
import '../../styles/MinesweeperGame/Player.css'

export default function Player(){
    return (
        <div id="player-box">
            <PlayerTimer />
            <ReadiedUP />
        </div>
    )
}