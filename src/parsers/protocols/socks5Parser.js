/**
 * SOCKS5 Parser for sublink-worker
 * 适配 Clash Verge 格式
 */
function parseSocks5(link, userAgent = null) {
    try {
        let parts = link.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0].trim();
        let name = parts[1] ? decodeURIComponent(parts[1].trim()) : 'SOCKS5节点';

        let username = undefined;
        let password = undefined;
        let hostPort = main;

        // 处理用户名:密码@服务器:端口
        if (main.includes('@')) {
            const [auth, hp] = main.split('@');
            hostPort = hp.trim();
            if (auth.includes(':')) {
                const [user, pass] = auth.split(':');
                username = user.trim();
                password = pass ? pass.trim() : '';
            } else {
                username = auth.trim();
            }
        }

        const [server, portStr] = hostPort.split(':');
        const port = parseInt(portStr, 10);

        if (!server || !port || isNaN(port)) {
            throw new Error('Invalid socks5 format');
        }

        return {
            name: name,           // Clash 需要 name
            type: 'socks5',
            server: server.trim(),
            port: port,           // 关键：使用 port 而不是 server_port
            username: username,
            password: password,
            udp: true,
        };
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message);
        return null;
    }
}

export { parseSocks5 };
