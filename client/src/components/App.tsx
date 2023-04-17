import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket';
import "../styles/App.css"


function App() {
  const navigate = useNavigate();

  let [maxBombs, setMaxBombs] = useState(20);

  const boardRef = useRef<any>(null);
  const bombsRef = useRef<any>(null);

  const setBombs = (e: React.MouseEvent) => {
    let maxAllowed: number = Math.floor(Math.pow(boardRef.current?.value, 2) / 2);
    setMaxBombs(maxAllowed);
  }

  const setBoard = (e: React.MouseEvent) => {
    let maxAllowed: number = Math.floor(Math.pow(boardRef.current?.value, 2) / 2);
    if (bombsRef.current.value > maxAllowed) bombsRef.current.value = maxAllowed;
  }

  const gameCreate = (e: React.MouseEvent) => {
    socket.emit('createGame', boardRef.current.value, bombsRef.current.value);
  }

  useEffect(() => {
    function createdGame(gameID: string): void{
      navigate(`./game/${gameID}`);
    }

    socket.on('connect', () => {
      console.log(`Socket connected at ${socket.id}`);
    })

    socket.on('createdGame', createdGame)

    return () => {
      socket.off('connect');
      socket.off('createdGame', createdGame);
    }
  }, [navigate])

  return (
    <div>
      <div className="gameSettings">
        <section>
          <label htmlFor="boardSize">Board Size:</label>
          <input id="boardSize" type="number" min={5} max={20} defaultValue={10} ref={boardRef} onClick={setBoard} />
        </section>
        <section>
          <label htmlFor="numOfBombs">Number of Bombs:</label>
          <input id="numOfBombs" type="number" min={1} max={maxBombs} defaultValue={10} onClick={setBombs} ref={bombsRef} />
        </section>
        <button onClick={gameCreate}>Create Game</button>
      </div>
    </div>
  )
}

export default App;
