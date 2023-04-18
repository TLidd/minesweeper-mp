import '../../styles/MinesweeperGame/InvitePlayers.css'
import { useRef } from 'react';

export default function InvitePlayers({linkCopy}: {linkCopy: string}) {
    let textRef = useRef(null);
    const copyLink = (e: React.MouseEvent) => {
        navigator.clipboard.writeText(linkCopy);
    }
  return (
    <div id='invite-link-box'>
        <span id='invite' ref={textRef}>{linkCopy}</span>
        <button onClick={copyLink}>Copy Link</button>
    </div>
  )
}
