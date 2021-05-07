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
exports.Message = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const chalk_1 = __importDefault(require("chalk"));
const lib_1 = require("../lib");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const responses_json_1 = __importDefault(require("../lib/responses.json"));
const Utils_1 = __importDefault(require("../Utils"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const info_1 = require("../lib/info");
const wallpaper_1 = require("../lib/wallpaper");
const reddit_1 = require("../lib/reddit");
class Message {
    constructor(client) {
        this.client = client;
        this.validTypes = [baileys_1.MessageType.text, baileys_1.MessageType.image, baileys_1.MessageType.video, baileys_1.MessageType.extendedText];
        this.handleGroupMessage = (M) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const from = M.key.remoteJid;
            if (!from)
                return;
            const { message } = ((_a = M.message) === null || _a === void 0 ? void 0 : _a.ephemeralMessage) || M;
            if (!message)
                return;
            const sender = M.participant;
            const mod = this.client._config.admins.includes(sender);
            const group = yield this.client.getGroupInfo(from);
            const { user, data: userData } = yield this.client.getUser(sender);
            const [admin, iAdmin] = [group.admins.includes(sender), group.admins.includes(this.client.user.jid)];
            const username = (user === null || user === void 0 ? void 0 : user.notify) || (user === null || user === void 0 ? void 0 : user.vname) || (user === null || user === void 0 ? void 0 : user.name) || '';
            const { body, media } = this.getBase(M, message);
            if (group.data.mod && !admin && iAdmin && !(yield this.moderate(M, body || '', group.metadata, username)))
                return void null;
            if (group.data.safe && !admin && iAdmin && (yield this.checkMessageandAct(M, username, group.metadata)))
                return void null;
            if (!body)
                return;
            const opt = this.parseArgs(body);
            if (!opt)
                return;
            const { args, flags } = opt;
            if (!args[0].startsWith(this.client._config.prefix))
                return this.freeText(body, M);
            const command = args[0].slice(1).toLowerCase();
            if (!command)
                return void this.client.reply(from, { body: responses_json_1.default['no-command-after-prefix'].replace('{P}', this.client._config.prefix) }, M);
            const slicedJoinedArgs = args
                .join(' ')
                .slice(command.length + this.client._config.prefix.length)
                .trim();
            const barSplit = slicedJoinedArgs.includes('|') ? slicedJoinedArgs.split('|') : [];
            const mentioned = ((_c = (_b = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.mentionedJid) &&
                message.extendedTextMessage.contextInfo.mentionedJid.length > 0
                ? (_d = message.extendedTextMessage.contextInfo) === null || _d === void 0 ? void 0 : _d.mentionedJid
                : ((_f = (_e = message.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.contextInfo) === null || _f === void 0 ? void 0 : _f.quotedMessage) &&
                    message.extendedTextMessage.contextInfo.participant
                    ? [message.extendedTextMessage.contextInfo.participant]
                    : [];
            console.log(chalk_1.default.green('[EXEC]'), chalk_1.default.blue(moment_timezone_1.default(Number(M.messageTimestamp) * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.blueBright(command), chalk_1.default.yellow('from'), chalk_1.default.white(username), chalk_1.default.yellow('in'), chalk_1.default.white(group.metadata.subject));
            if (userData.ban)
                return void this.client.reply(from, { body: responses_json_1.default['banned'] }, M);
            const ad = Math.floor(Math.random() * 5) + 1;
            try {
                switch (command) {
                    default:
                        this.client.reply(from, { body: responses_json_1.default['invalid-command'] }, M);
                        break;
                    case 'id':
                        return void this.client.reply(from, { body: `GID: ${from}` }, M);
                    case 'everyone':
                        return void this.client.everyone(from, group.metadata, admin, flags.includes('--hide'), M);
                    case 'group':
                        return void this.client.reply(from, yield this.client.group.simplifiedGroupInfo(group), M);
                    case 'eval':
                        if (mod)
                            return void eval(slicedJoinedArgs);
                        break;
                    case 'join':
                        return void this.client.reply(from, from === process.env.ADMIN_GROUP_JID
                            ? yield this.client.group.join(slicedJoinedArgs, mod, username)
                            : { body: responses_json_1.default['cannot-execute'] }, M);
                    case 'ban':
                    case 'unban':
                        if (!mod || mentioned.length === 0)
                            return;
                        return this.client.banAction(from, mentioned, command === 'ban', M);
                        break;
                    case 'hi':
                        this.client.reply(from, { body: `Hi! ${username}` }, M);
                        break;
                    case 'promote':
                    case 'demote':
                    case 'remove':
                        this.client.reply(from, yield this.client.group.toggleEvent(from, mentioned, admin, iAdmin, command), M);
                        break;
                    case 'help':
                        this.client.reply(from, { body: lib_1.help(this.client, slicedJoinedArgs.toLowerCase().trim()) }, M);
                        break;
                    case 'sticker':
                        const sticker = !media
                            ? { body: responses_json_1.default['wrong-format-media'] }
                            : yield lib_1.createSticker(yield this.client.downloadMediaMessage(media), flags.includes('--strech'), barSplit[1], barSplit[2]);
                        const m = yield this.client.reply(from, sticker, M);
                        if (m && typeof m === 'object' && ((_h = (_g = m) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.stickerMessage) && ad === 5)
                            return void this.client.reply(from, { body: responses_json_1.default['ads']['sticker'] }, m);
                        break;
                    case 'wallpaper':
                        return void this.client.reply(from, yield wallpaper_1.wallpaper(slicedJoinedArgs), M);
                    case 'anime':
                    case 'manga':
                    case 'character':
                        this.client.reply(from, yield lib_1.wSearch(slicedJoinedArgs, this.client._config.prefix, command), M);
                        break;
                    case 'aid':
                    case 'mid':
                    case 'chid':
                        this.client.reply(from, yield lib_1.getWById(slicedJoinedArgs, command === 'aid' ? 'anime' : command === 'mid' ? 'manga' : 'character'), M);
                        break;
                    case 'register':
                    case 'unregister':
                        return void this.client.reply(from, yield this.client.group.register(admin, group.data, command === 'register', slicedJoinedArgs.toLowerCase().trim()), M);
                    case 'yta':
                    case 'ytv':
                        return void this.client.reply(from, yield lib_1.getYTMediaFromUrl(slicedJoinedArgs.trim(), command === 'ytv' ? 'video' : 'audio'), M);
                    case 'yts':
                        return void this.client.reply(from, { body: yield lib_1.ytSreach(slicedJoinedArgs.trim()) }, M);
                    case 'lyrics':
                        return void this.client.reply(from, { body: yield lib_1.lyrics(slicedJoinedArgs) }, M);
                    case 'info':
                        return void this.client.reply(from, yield info_1.info(), M);
                    case 'commits':
                    case 'issues':
                        return void this.client.reply(from, yield info_1.getRepoInfo(command), M);
                    case 'open':
                    case 'close':
                        return void this.client.reply(from, yield this.client.group.announce(group.metadata, admin, iAdmin, command === 'close'));
                    case 'purge':
                        return void this.client.reply(from, yield this.client.group.purge(group.metadata, sender, iAdmin), M);
                    case 'delete':
                        return void this.client.reply(from, { body: admin ? yield this.client.deleteQuotedMessage(M) : responses_json_1.default['user-lacks-permission'] }, M);
                    case 'subred':
                        return void this.client.reply(from, yield reddit_1.reddit(slicedJoinedArgs, !group.data.nsfw), M);
                }
            }
            catch (err) {
                console.log(err);
                return void this.client.reply(from, {
                    body: yield fs_extra_1.readFile(path_1.join(this.client.assets, 'images', 'Error-500.gif')),
                    caption: !mod ? responses_json_1.default.error[500].regular : responses_json_1.default.error[500].mod.replace('{M}', err.message),
                    type: baileys_1.MessageType.video,
                    mime: baileys_1.Mimetype.gif
                }, M);
            }
        });
        this.handleDirectMessage = (M) => __awaiter(this, void 0, void 0, function* () {
            const from = M.key.remoteJid;
            if (!from)
                return;
            const { message } = M;
            if (!message)
                return;
            const { body } = this.getBase(M, message);
            if (!body)
                return;
            const opt = this.parseArgs(body);
            if (!opt)
                return;
            const { args } = opt;
            const { user, data } = yield this.client.getUser(from);
            if (data.ban)
                return;
            const username = (user === null || user === void 0 ? void 0 : user.notify) || (user === null || user === void 0 ? void 0 : user.vname) || (user === null || user === void 0 ? void 0 : user.name) || '';
            const cmd = args[0].startsWith(this.client._config.prefix);
            console.log(chalk_1.default.green(!cmd ? '[CHAT]' : '[EXEC]'), chalk_1.default.blue(moment_timezone_1.default(Number(M.messageTimestamp) * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.blueBright(args[0], `[${args.length}]`), chalk_1.default.yellow('from'), chalk_1.default.white(username));
            if (!cmd)
                return process.env.EIF
                    ? void this.client.reply(from, {
                        body: (yield Utils_1.default.fetch(`${process.env.EIF}/${encodeURI(`chatbot?message=${body}&bot=${this.client._config.name}&user=${from}`)}`, {})).message
                    }, M)
                    : void null;
            const command = args[0].slice(1).toLowerCase();
            const mod = this.client._config.admins.includes(from);
            if (!command)
                return;
            switch (command) {
                default:
                    return void this.client.reply(from, { body: responses_json_1.default['direct-message-cmd'] }, M);
                case 'join':
                    return void this.client.reply(from, yield this.client.group.join(body, mod, username));
                case 'eval':
                    if (mod)
                        return void eval(args.slice(1).join(' ').trim());
                    break;
            }
        });
        this.validate = (Msg) => {
            var _a, _b, _c;
            const M = ((_a = Msg.message) === null || _a === void 0 ? void 0 : _a.ephemeralMessage) || Msg;
            if (!M.message)
                return false;
            if (!!Msg.key.fromMe)
                return false;
            if ((_b = Msg.key.remoteJid) === null || _b === void 0 ? void 0 : _b.endsWith('broadcast'))
                return false;
            const type = Object.keys(M.message)[0];
            if (!this.validTypes.includes(type))
                return false;
            return { type: type, chat: ((_c = Msg.key.remoteJid) === null || _c === void 0 ? void 0 : _c.endsWith('g.us')) ? 'group' : 'dm' };
        };
        this.getBase = (M, message) => {
            var _a, _b, _c, _d, _e, _f;
            const body = (message === null || message === void 0 ? void 0 : message.conversation)
                ? message.conversation
                : (message === null || message === void 0 ? void 0 : message.extendedTextMessage)
                    ? message.extendedTextMessage.text
                    : (message === null || message === void 0 ? void 0 : message.imageMessage)
                        ? message.imageMessage.caption
                        : (message === null || message === void 0 ? void 0 : message.videoMessage)
                            ? message.videoMessage.caption
                            : null;
            const media = (message === null || message === void 0 ? void 0 : message.imageMessage) || (message === null || message === void 0 ? void 0 : message.videoMessage)
                ? M
                : ((_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _a === void 0 ? void 0 : _a.contextInfo) === null || _b === void 0 ? void 0 : _b.quotedMessage) === null || _c === void 0 ? void 0 : _c.imageMessage) ||
                    ((_f = (_e = (_d = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.contextInfo) === null || _e === void 0 ? void 0 : _e.quotedMessage) === null || _f === void 0 ? void 0 : _f.videoMessage)
                    ? JSON.parse(JSON.stringify(M).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                    : null;
            return { body, media };
        };
        this.parseArgs = (text) => {
            const [args, flags] = [[], []];
            if (!text)
                return false;
            const baseArgs = text.split(' ');
            baseArgs.forEach((arg) => {
                if (arg === null || arg === void 0 ? void 0 : arg.startsWith('--'))
                    flags.push(arg);
                args.push(arg);
            });
            return { args, flags };
        };
        this.freeText = (text, M) => __awaiter(this, void 0, void 0, function* () {
            const args = text.split(/ +/g);
            const from = M.key.remoteJid;
            if (!from)
                return;
            const { user, data: userData } = yield this.client.getUser(M.participant);
            if (userData.ban)
                return;
            const username = (user === null || user === void 0 ? void 0 : user.notify) || (user === null || user === void 0 ? void 0 : user.vname) || (user === null || user === void 0 ? void 0 : user.name) || '';
            const group = yield this.client.getGroupInfo(from);
            const admin = group.admins.includes(user.jid);
            let txt = args[0].toLowerCase();
            let [log, body] = [false, ''];
            if (args.includes('@everyone') && admin) {
                if (admin)
                    void this.client.everyone(from, group.metadata, true, false, M);
                log = true;
                txt = '@everyone';
            }
            switch (txt) {
                case 'hey':
                    body = 'Hi there!';
                    log = true;
                    break;
                case 'test':
                    body = 'Well...';
                    log = true;
                    break;
            }
            if (log) {
                console.log(chalk_1.default.white('[TEXT]'), chalk_1.default.blue(moment_timezone_1.default(Number(M.messageTimestamp) * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.blueBright(text), chalk_1.default.yellow('from'), chalk_1.default.white(username), chalk_1.default.yellow('in'), chalk_1.default.white(group.metadata.subject));
                if (body)
                    this.client.reply(from, { body }, M);
            }
        });
        this.checkMessageandAct = (M, username, metadata) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            if (!((_j = M.message) === null || _j === void 0 ? void 0 : _j.imageMessage))
                return false;
            if (yield this.client.ML.nsfw.check(yield this.client.downloadMediaMessage(M))) {
                yield this.client.reply(metadata.id, { body: responses_json_1.default['nsfw-detected'] }, M);
                yield this.client.group.toggleEvent(metadata.id, [M.participant], true, true, 'remove');
                console.log(chalk_1.default.redBright('[NSFW]'), chalk_1.default.yellow(moment_timezone_1.default(M.messageTimestamp * 1000).format('DD/MM HH:mm:ss')), 'By', chalk_1.default.red(username), 'in', chalk_1.default.red(metadata.subject));
                return true;
            }
            return false;
        });
        this.moderate = (M, text, metadata, username) => __awaiter(this, void 0, void 0, function* () {
            if (this.checkForGroupLink(text)) {
                yield this.client.reply(M.key.remoteJid, { body: responses_json_1.default['mod']['group-invite'] }, M);
                yield this.client.groupRemove(M.key.remoteJid, [M.participant]);
                console.log(chalk_1.default.redBright('[MOD] GROUP LINK'), chalk_1.default.yellow(moment_timezone_1.default(M.messageTimestamp * 1000).format('DD/MM HH:mm:ss')), 'By', chalk_1.default.red(username), 'in', chalk_1.default.red(metadata.subject));
                return false;
            }
            return true;
        });
        this.checkForGroupLink = (text) => text.includes('chat.whatsapp.com');
        this.isMessageSafe = (M) => {
            if (M.messageStubType === baileys_1.WA_MESSAGE_STUB_TYPE.OVERSIZED)
                return false;
            return true;
        };
        this.loopText = (inc) => {
            let text = `\n`;
            for (let i = 0; i < inc; i++)
                text += `\n`;
            return text;
        };
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map