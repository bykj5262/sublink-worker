/**
 * SOCKS5 Parser - 适配 Clash Verge 要求
 */
function parseSocks5(link, userAgent = null) {
    try {
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
            console.error('[SOCKS5] Invalid format');
            return null;
        }

        // 直接返回 Clash 需要的字段
        return {
            name: name,           // 关键修改
            type: 'socks5',
            server: server.trim(),
            port: port,           // 关键修改：用 port 而不是 server_port
            username: username,
            password: password,
            udp: true
        };
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message);
        return null;
    }
}

export { parseSocks5 };
