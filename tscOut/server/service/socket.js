import * as websocket from 'ws';
const WebSocketServer = websocket.Server;
export const clientList = {};
export class Socket {
    init() {
        const wss = new WebSocketServer({ port: 8181 });
        console.log('webSocket server is running on 8181');
        wss.on('connection', function (ws) {
            ws.on('message', function (message) {
                console.log(message);
                const data = JSON.parse(message);
                if (data.type === 'regist') {
                    clientList[data.deviceId] = (e) => ws.send(JSON.stringify(e));
                }
            });
        });
    }
    sendRequest(deviceId, startTime, endTime) {
        if (clientList[deviceId]) {
            clientList[deviceId]({
                startTime, endTime, type: 'upload'
            });
            return true;
        }
        else {
            return false;
        }
    }
}
const socket = new Socket();
export default socket;
//# sourceMappingURL=socket.js.map