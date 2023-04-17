import '../styles/Tile.css'
import { useState } from 'react';

export default function Tile({ x, y, tileMarker, clickedCallback }: { x: number, y: number, tileMarker: number, clickedCallback: (xPoint: number, yPoint: number) => void }) {
    let [rightClickedTile, setRightClickedTile] = useState(false);
    let [leftClickedTile, setLeftClickedTile] = useState(false);

    //right click to allow marking bombs on board
    const rightClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!leftClickedTile) {
            if (rightClickedTile) setRightClickedTile(false);
            else setRightClickedTile(true);
        }
    }

    //on left click let game component page know what tile coords was clicked and reveal the tile.
    const leftClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!leftClickedTile) {
            setLeftClickedTile(true);
            clickedCallback(x, y);
        }
    }

    if (tileMarker != -2 && leftClickedTile == false) {
        setLeftClickedTile(true);
    }


    return (
        <button className={`tile ${leftClickedTile ? 'tileClicked' : ''}`} onClick={leftClicked} onContextMenu={rightClicked}>{rightClickedTile && !leftClickedTile ? 'B' : leftClickedTile ? tileMarker == 0 ? '‎' : `${tileMarker}` : '‎'}</button>
    )
}

Tile.defaultProps = {
    x: 5,
    y: 4,
}