"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoInfo = exports.info = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const path_1 = require("path");
const Utils_1 = __importDefault(require("../Utils"));
const xre = `https://opengraph.githubassets.com/e3ea92ae0b9155ea89ae7afad6a83898b4555bf33b7c0abeef478ba694de5e1f/Synthesized-Infinity/Whatsapp-Botto-Xre`;
const info = () => __awaiter(void 0, void 0, void 0, function* () {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(path_1.join(__dirname, '..', '..', 'package.json'));
    const deps = Object.keys(pkg.dependencies);
    return {
        body: yield Utils_1.default.download(xre),
        caption: `š¤ ${process.env.BOT_NAME} š¤\n\nš *Homepage:* ${pkg.homepage}\n\nš *Repository:* ${pkg.repository.url}\n\nš *Dependencies:*\n${deps.join('\n')}\n\nš *Stickers:* https://www.npmjs.com/package/wa-sticker-formatter\n\nš ļø *APIs & Tools:* https://express-is-fun.herokuapp.com/api/endpoints\n\n*-į“”į“-Źį“į“į“į“-xŹį“-*`,
        type: baileys_1.MessageType.image
    };
});
exports.info = info;
const getRepoInfo = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Utils_1.default.fetch(`https://api.github.com/repos/Synthesized-Infinity/Whatsapp-Botto-Xre/${type}`, {});
    if (!data[0])
        return { body: 'š® *No Issues open* š®' };
    let body = `š *WhatsApp Botto Xre-Recent ${Utils_1.default.capitalize(type)}* š\n\n`;
    const len = data.length < 5 ? data.length : 5;
    if (type === 'commits') {
        for (let c = 0; c < len; c++) {
            body += `*#${c + 1}.*\nāļø *Commit Message:* ${data[c].commit.message}\nš *Date:* ${data[c].commit.author.date}\nš± *Author:* ${data[c].commit.author.name}\nš *URL*: ${data[c]['html_url']}\n\n`;
        }
        return { caption: body, body: yield Utils_1.default.download(`${xre}/commit/${data[0].sha}`), type: baileys_1.MessageType.image };
    }
    for (let i = 0; i < data.length; i++) {
        body += `*#${i + 1}.*\n\nš“ *Title: ${data[i].title}*\nš± *User:* ${data[i].user.login}\nć½ļø URL: ${data[i].url}\n\n`;
    }
    return { body };
});
exports.getRepoInfo = getRepoInfo;
//# sourceMappingURL=info.js.map