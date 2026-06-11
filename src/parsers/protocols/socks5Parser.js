/**
 * SOCKS5 Parser for sublink-worker
 * 支持格式：socks5://host:port#备注 或 socks5://user:pass@host:port#备注
 */

function parseSocks5(link) {
    try {
        let parts = link.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0];
        let tag = parts[1] ? decodeURIComponent(parts[1].trim()) : `SOCKS5-${Date.now()}`;

        let username = null;
        let password = null;
        let hostPort = main;

        // 处理带认证信息
        if (main.includes('@')) {
            const [auth, hp] = main.split('@');
            hostPort = hp;
            if (auth.includes(':')) {
                [username, password] = auth.split(':');
            } else {
                username = auth;
            }
        }

        const [server, portStr] = hostPort.split(':');
        const server_port = parseInt(portStr, 10);

        if (!server || !server_port) throw new Error('Invalid format');

        return {
            tag: tag,
            type: 'socks5',
            server: server.trim(),
            server_port: server_port,
            username: username ? username.trim() : undefined,
            password: password ? password.trim() : undefined,
        };
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message);
        return null;
    }
}

export { parseSocks5 };
