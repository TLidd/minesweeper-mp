interface PlayerReadyProps{
    readyCallback: () => void;
    isOpponent: boolean;
    isReady?: boolean;
}

export default function PlayerReady({readyCallback, isOpponent, isReady}: PlayerReadyProps){
    return (
        <div className='ready-box'>
            {
                isOpponent && isReady && <span>Your opponent is ready</span>
            }
            {
                !isOpponent && <div>
                <label htmlFor="checkPlayer">I am Ready!</label>
                <input id="checkPlayer" type="checkbox" onChange={readyCallback}/>
                </div>
            }
        </div>
    )
}