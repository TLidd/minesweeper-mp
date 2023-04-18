import { useEffect, useState } from 'react';
import '../../styles/MinesweeperGame/PlayerTimer.css'

interface PlayerTimerProps{
    timeRemaining: number;
    runTimer: boolean;
    isOpponent: boolean;
    lostCallback: () => void;
}

export default function PlayerTimer({timeRemaining, runTimer, isOpponent, lostCallback}: PlayerTimerProps) {
    let [timeLeft, setTimeLeft] = useState<number>(timeRemaining);
    let mins: number = Math.floor(timeLeft / 60000);
    let seconds: number = Number(((timeLeft % 60000) / 1000).toFixed(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prevState) => {
                if(prevState - 1000 <= 0){
                    clearInterval(interval);
                    //if not opponent tell server that player lost.
                    if(!isOpponent){
                        lostCallback();
                    }
                    return 0;
                }
                if(runTimer) return prevState - 1000;
                else return prevState;
            });
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [runTimer, isOpponent, lostCallback])

  return (
    <div id='player-timer'>
        {(mins < 10 ? '0' : '') + mins+ ":" + (seconds < 10 ? '0' : '') + seconds}
    </div>
  )
}

PlayerTimer.defaultProps = {
    timeRemaining: 290000,
}
