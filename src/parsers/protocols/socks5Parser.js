/**
 * SOCKS5 Parser for sublink-worker
 * 严格适配项目内部格式 + Clash Builder
 */
function parseSocks5(link, userAgent = null) {
    try {
        let cleanLink = decodeURIComponent(link.trim());
        let parts = cleanLink.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0].trim();
        let tag = parts[1] ? parts[1].trim() : 'SOCKS5节点';

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
        const server_port = parseInt(portStr, 10);

        if (!server || !server_port || isNaN(server_port)) {
            console.error('[SOCKS5] Invalid format');
            return null;
        }

        // 关键：使用项目主流 Parser 风格
        return {
            tag: tag,
            type: 'socks5',
            server: server.trim(),
            server_port: server_port,
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
