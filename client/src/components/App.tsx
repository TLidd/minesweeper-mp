import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket';
import "../styles/App.css"


function App() {
  const navigate = useNavigate();

  let [boardSize, setBoardSize] = useState<number>(10);

  let [lowBombRange, setLowBombRange] = useState<number>(25);
  let [highBombRange, setHighBombRange] = useState<number>(25);


  const setLowRange = (e: React.FormEvent<HTMLInputElement>) => {
    if(Number(e.currentTarget.value) > highBombRange) setHighBombRange(Number(e.currentTarget.value));
    setLowBombRange(Number(e.currentTarget.value));
  }
  
  const setHighRange = (e: React.FormEvent<HTMLInputElement>) => {
    if(Number(e.currentTarget.value) < lowBombRange) setLowBombRange(Number(e.currentTarget.value));
    setHighBombRange(Number(e.currentTarget.value));
  }

  const setBoard = (e: React.FormEvent<HTMLInputElement>) => {
    let halfwayPoint = Math.floor((Math.pow(Number(e.currentTarget.value), 2) / 2) / 2);
    setHighBombRange(halfwayPoint);
    setLowBombRange(halfwayPoint);
    setBoardSize(Number(e.currentTarget.value));
  }

  const gameCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const randomNumber = Math.floor(Math.random() * (highBombRange - lowBombRange) + lowBombRange);
    socket.emit('createGame', boardSize, randomNumber);
  }

  useEffect(() => {
    function createdGame(gameID: string): void{
      navigate(`./game/${gameID}`);
    }

    socket.on('connect', () => {
      console.log(`Socket connected at ${socket.id}`);
    });

    socket.on('createdGame', createdGame);

    return () => {
      socket.off('connect');
      socket.off('createdGame', createdGame);
    }
  }, [navigate])

  return (
    <form className="gameSettings" onSubmit={gameCreate}>
      <label htmlFor="boardSize">Board Size</label>
      <input id="boardSize" type="range" min={5} max={25} defaultValue={10} onChange={setBoard} />
      <output htmlFor='boardSize'>{boardSize}</output>

      <label htmlFor='lowRange'>Low Range</label>
      <input id='lowRange' type='range' min={1} max={Math.floor(Math.pow(boardSize, 2) / 2)} value={lowBombRange} onChange={setLowRange}></input>
      <output htmlFor='lowRange'>{lowBombRange}</output>

      <label htmlFor='highRange'>High Range</label>
      <input id='highRange' type='range' min={1} max={Math.floor(Math.pow(boardSize, 2) / 2)} value={highBombRange} onChange={setHighRange}></input>
      <output htmlFor='highRange'>{highBombRange}</output>

      <button type='submit'>Create Game</button>
    </form>
  )
}

export default App;
