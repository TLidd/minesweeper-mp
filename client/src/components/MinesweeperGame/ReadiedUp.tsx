import '../../styles/MinesweeperGame/ReadiedUp.css';

export default function ReadiedUP({readyCallback, gameStarted}: {readyCallback: () => void, gameStarted: boolean}){
    return (
        <div className={`ready-box ${gameStarted ? 'hide-check-box' : ''}`}>
            <label htmlFor="checkPlayer">I am Ready!</label>
            <input id="checkPlayer" type="checkbox" onChange={readyCallback}/>
        </div>
    )
}