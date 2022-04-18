function getSocketHost() {
    const url: any = location;
    const host = url.host;
    const isHttps = url.protocol === 'https:';
    return `${isHttps ? 'wss' : 'ws'}://${host}`;
}
if ('WebSocket' in window) {
    const socket = new WebSocket(getSocketHost(), 'malita-hmr');
    let pingTimer: NodeJS.Timer | null = null;
    socket.addEventListener('message', async ({ data }) => {
        data = JSON.parse(data);
        if (data.type === 'connected') {
            console.log(`[malita] connected.`);
            // 心跳包 
            pingTimer = setInterval(() => socket.send('ping'), 30000);
        }
        if (data.type === 'reload') window.location.reload();
    });

    async function waitForSuccessfulPing(ms = 1000) {
        while (true) {
            try {
                await fetch(`/__malita_ping`);
                break;
            } catch (e) {
                await new Promise((resolve) => setTimeout(resolve, ms));
            }
        }
    }

    socket.addEventListener('close', async () => {
        if (pingTimer) clearInterval(pingTimer);
        console.info('[malita] Dev server disconnected. Polling for restart...');
        await waitForSuccessfulPing();
        location.reload();
    });
}