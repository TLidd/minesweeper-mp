import { useEffect } from 'react';
import '../../styles/MinesweeperGame/PlayerTimer.css'

import { Dispatch, SetStateAction } from 'react';

interface PlayerTimerProps{
    timeRemaining: number;
    runTimer: boolean;
    isOpponent: boolean;
    lostCallback: () => void;
    setTimeRemaining: Dispatch<SetStateAction<number>>;
}

export default function PlayerTimer({timeRemaining, runTimer, isOpponent, lostCallback, setTimeRemaining}: PlayerTimerProps) {
    let mins: number = Math.floor(timeRemaining / 60000);
    let seconds: number = Number(((timeRemaining % 60000) / 1000).toFixed(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prevState) => {
                if(prevState - 10 <= 0){
                    clearInterval(interval);
                    //if not opponent tell server that player lost.
                    if(!isOpponent){
                        lostCallback();
                    }
                    return 0;
                }
                if(runTimer) return prevState - 10;
                else return prevState;
            });
        }, 10)

        return () => {
            clearInterval(interval);
        }
    }, [runTimer, isOpponent, lostCallback, setTimeRemaining])

  return (
    <div id='player-timer'>
        {(mins < 10 ? '0' : '') + mins+ ":" + (seconds < 10 ? '0' : '') + seconds}
    </div>
  )
}

PlayerTimer.defaultProps = {
    timeRemaining: 290000,
}
