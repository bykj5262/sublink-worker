/**
 * SOCKS5 Parser for sublink-worker
 * 支持格式：socks5://host:port#备注 或 socks5://user:pass@host:port#备注
 */
function parseSocks5(link, userAgent = null) {
    try {
        let parts = link.replace(/^socks5:\/\//i, '').split('#');
        let main = parts[0].trim();
        let remark = parts[1] ? decodeURIComponent(parts[1].trim()) : `SOCKS5-${Date.now()}`;

        let username = undefined;
        let password = undefined;
        let hostPort = main;

        // 处理带用户名密码
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
        const port = parseInt(portStr, 10);

        if (!server || !port || isNaN(port)) {
            throw new Error('Invalid socks5 format');
        }

        return {
            name: remark,                    // ← 必须是 name
            type: 'socks5',
            server: server.trim(),
            port: port,                      // ← 必须是 port（不是 server_port）
            username: username ? username.trim() : undefined,
            password: password ? password.trim() : undefined,
            udp: true,                       // 可选，建议加上
        };
    } catch (e) {
        console.error('[SOCKS5 Parser] Error:', e.message);
        return null;
    }
}

export { parseSocks5 };
