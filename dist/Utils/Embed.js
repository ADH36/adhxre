"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Embed {
    constructor(config) {
        this.header = `ᴇᴍʙᴇᴅ ᴛᴇxᴛ`;
        this.body = '';
        this.footer = 'ᴡᴀ-ʙᴏᴛᴛᴏ-xʀᴇ';
        this.setHeader = (header) => {
            this.header = header;
        };
        this.setBody = (body) => {
            const args = body.split('\n');
            body = '';
            args.forEach((text) => (body += `┠≽ ${text}`));
        };
        this.setFooter = (footer) => {
            this.footer = footer;
        };
        this.get = () => {
            return `┏〈 ${this.header} 〉\n ╽\n${this.body}\n╿\n╰╼≽`;
        };
        if (config === null || config === void 0 ? void 0 : config.header)
            this.setHeader(config.header);
        if (config === null || config === void 0 ? void 0 : config.body)
            this.setBody(config.body);
        if (config === null || config === void 0 ? void 0 : config.footer)
            this.setFooter(config.footer);
    }
}
exports.default = Embed;
//# sourceMappingURL=Embed.js.map