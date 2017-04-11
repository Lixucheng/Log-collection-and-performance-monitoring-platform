import * as websocket from 'ws';
const WebSocketServer = websocket.Server;

export const clientList = {};


export default class socket {
  constructor() {
    const wss = new WebSocketServer({ port: 8181 });
    wss.on('connection', function (ws) {
      console.log('client connected');
      ws.on('message', function (message) {
        console.log(message);
        const data = JSON.parse(message);
        if (data.type === 'regist') {
          clientList[data.deviceId] = (e) =>  ws.send(e);
          clientList[data.deviceId]('success');
        }
      });
    });
  }
}
