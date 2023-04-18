import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

let url: string | undefined = process.env.REACT_APP_SOCKET_SERVER;
export const socket = io(url!);