/**
 * SOCKS5 Parser for sublink-worker
 * 高度兼容 Clash Verge
 */
function parseSocks5(link, userAgent = null) {
    try {
        // 解码并清理
        let cleanLink = decodeURIComponent(link.trim());
        
        let parts = cleanLink.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0].trim();
        let name = parts[1] ? parts[1].trim() : 'SOCKS5节点';

        let username = undefined;
        let password = undefined;
        let hostPort = main;

        // 处理 user:pass@host:port
        if (main.includes('@')) {
            const [auth, hp] = main.split('@');
            hostPort = hp.trim();
            if (auth.includes(':')) {
                const [user, pass] = auth.split(':', 2);  // 只分割一次
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

        // 返回项目内部期望的格式（兼容性最高）
        return {
            name: name,
            type: 'socks5',
            server: server.trim(),
            port: port,
            username: username,
            password: password,
            udp: true
        };
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message, link);
        return null;
    }
}

export { parseSocks5 };
