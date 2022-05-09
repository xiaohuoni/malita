import { Server as HttpServer } from 'http';
import { WebSocketServer } from '../compiled/ws';

export function createWebSocketServer(server: HttpServer) {
    const wss = new WebSocketServer({
        noServer: true,
    });

    server.on('upgrade', (req, socket, head) => {
        if (req.headers['sec-websocket-protocol'] === 'malita-hmr') {
            wss.handleUpgrade(req, socket as any, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        }
    });

    wss.on('connection', (socket) => {
        socket.send(JSON.stringify({ type: 'connected' }));
    });

    wss.on('error', (e: Error & { code: string }) => {
        if (e.code !== 'EADDRINUSE') {
            console.error(
                `WebSocket server error:\n${e.stack || e.message}`,
            );
        }
    });

    return {
        send(message: string) {
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(message);
                }
            });
        },
        wss,
        close() {
            wss.close();
        },
    };
}
