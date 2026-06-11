import { parseShadowsocks } from './protocols/shadowsocksParser.js';
import { parseVmess } from './protocols/vmessParser.js';
import { parseVless } from './protocols/vlessParser.js';
import { parseHysteria2 } from './protocols/hysteria2Parser.js';
import { parseTrojan } from './protocols/trojanParser.js';
import { parseTuic } from './protocols/tuicParser.js';
import { parseSocks5 } from './protocols/socks5Parser.js';   // ← 确保这一行存在

import { fetchSubscription } from './subscription/httpSubscriptionFetcher.js';

const protocolParsers = {
    ss: parseShadowsocks,
    socks5: parseSocks5,
    socks: parseSocks5,        // 支持 socks://
    vmess: parseVmess,
    vless: parseVless,
    hysteria: parseHysteria2,
    hysteria2: parseHysteria2,
    hy2: parseHysteria2,
    http: fetchSubscription,
    https: fetchSubscription,
    trojan: parseTrojan,
    tuic: parseTuic
};

export class ProxyParser {
    static async parse(url, userAgent) {
        if (!url || typeof url !== 'string') {
            return undefined;
        }
        const trimmed = url.trim();
        const type = trimmed.split('://')[0].toLowerCase();   // 建议加 toLowerCase() 更稳健
        const parser = protocolParsers[type];
        if (!parser) {
            return undefined;
        }
        return parser(trimmed, userAgent);
    }
}
