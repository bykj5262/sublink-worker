function parseSocks5(link, userAgent = null) {
    try {
        console.log('[SOCKS5 Parser] Input:', link);  // 调试日志

        let cleanLink = decodeURIComponent(link.trim());
        let parts = cleanLink.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0].trim();
        let name = parts[1] ? parts[1].trim() : 'SOCKS5节点';

        let username = undefined;
        let password = undefined;
        let hostPort = main;

        if (main.includes('@')) {
            const [auth, hp] = main.split('@');
            hostPort = hp.trim();
            if (auth.includes(':')) {
                const [user, pass] = auth.split(':', 2);
                username = user.trim();
                password = pass ? pass.trim() : '';
            } else {
                username = auth.trim();
            }
        }

        const [server, portStr] = hostPort.split(':');
        const port = parseInt(portStr, 10);

        if (!server || !port || isNaN(port)) {
            console.error('[SOCKS5] Invalid format:', main);
            return null;
        }

        const result = {
            name: name,
            type: 'socks5',
            server: server.trim(),
            port: port,
            username: username,
            password: password,
            udp: true
        };

        console.log('[SOCKS5 Parser] Success Output:', result);  // 调试日志
        return result;
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message, link);
        return null;
    }
}

export { parseSocks5 };
