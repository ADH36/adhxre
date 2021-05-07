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
        caption: `🤖 ${process.env.BOT_NAME} 🤖\n\n🌟 *Homepage:* ${pkg.homepage}\n\n🍀 *Repository:* ${pkg.repository.url}\n\n🍁 *Dependencies:*\n${deps.join('\n')}\n\n🌇 *Stickers:* https://www.npmjs.com/package/wa-sticker-formatter\n\n🛠️ *APIs & Tools:* https://express-is-fun.herokuapp.com/api/endpoints\n\n*-ᴡᴀ-ʙᴏᴛᴛᴏ-xʀᴇ-*`,
        type: baileys_1.MessageType.image
    };
});
exports.info = info;
const getRepoInfo = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Utils_1.default.fetch(`https://api.github.com/repos/Synthesized-Infinity/Whatsapp-Botto-Xre/${type}`, {});
    if (!data[0])
        return { body: '💮 *No Issues open* 💮' };
    let body = `🌟 *WhatsApp Botto Xre-Recent ${Utils_1.default.capitalize(type)}* 🌟\n\n`;
    const len = data.length < 5 ? data.length : 5;
    if (type === 'commits') {
        for (let c = 0; c < len; c++) {
            body += `*#${c + 1}.*\n✉️ *Commit Message:* ${data[c].commit.message}\n📅 *Date:* ${data[c].commit.author.date}\n🔱 *Author:* ${data[c].commit.author.name}\n🍀 *URL*: ${data[c]['html_url']}\n\n`;
        }
        return { caption: body, body: yield Utils_1.default.download(`${xre}/commit/${data[0].sha}`), type: baileys_1.MessageType.image };
    }
    for (let i = 0; i < data.length; i++) {
        body += `*#${i + 1}.*\n\n🔴 *Title: ${data[i].title}*\n🔱 *User:* ${data[i].user.login}\n〽️ URL: ${data[i].url}\n\n`;
    }
    return { body };
});
exports.getRepoInfo = getRepoInfo;
//# sourceMappingURL=info.js.map