import '../../styles/MinesweeperGame/PlayerReady.css'

interface PlayerReadyProps{
    readyCallback: () => void;
    isOpponent: boolean;
    isReady?: boolean;
}

export default function PlayerReady({readyCallback, isOpponent, isReady}: PlayerReadyProps){
    return (
        <div id='ready-box'>
            {
                isOpponent && <div id='opponent'><span id={isReady ? 'ready' : 'not-ready'}>Your opponent is ready</span></div>
            }
            {
                !isOpponent && <div>
                <label htmlFor="check-player">I am Ready!</label>
                <input id="check-player" type="checkbox" onChange={readyCallback}/>
                </div>
            }
        </div>
    )
}