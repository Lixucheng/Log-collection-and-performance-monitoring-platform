import * as websocket from 'ws';
const WebSocketServer = websocket.Server;


export default class socket {
  constructor() {
    const wss = new WebSocketServer({ port: 8181 });
    wss.on('connection', function (ws) {
      console.log('client connected');
      ws.on('message', function (message) {
        console.log(message);
        ws.send(`get ${message}`)
      });
    });
  }
}
