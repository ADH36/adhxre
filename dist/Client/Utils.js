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
exports.Client = void 0;
const baileys_1 = require("@adiwajshing/baileys/");
const responses_json_1 = __importDefault(require("../lib/responses.json"));
const node_cron_1 = require("node-cron");
const chalk_1 = __importDefault(require("chalk"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const browser = ['WhatsApp-Botto-Xre', 'Well', 'Indeed'];
class Client extends baileys_1.WAConnection {
    constructor(GroupModel, UserModel, SessionModel) {
        super();
        this.GroupModel = GroupModel;
        this.UserModel = UserModel;
        this.SessionModel = SessionModel;
        this.assets = path_1.join(__dirname, '..', '..', 'assets');
        this.browserDescription = browser;
        this.config = {
            name: process.env.BOT_NAME || 'Xre',
            prefix: process.env.PREFIX || '!',
            admins: this.getMods(),
            cron: process.env.CRON || null
        };
        this.clearCycle = (time) => __awaiter(this, void 0, void 0, function* () {
            if (!node_cron_1.validate(time))
                return console.log(chalk_1.default.redBright('[CRON]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.red('Invalid Cron String', time));
            console.log(chalk_1.default.blueBright('[CRON]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Cron Job for Clearing all chas has been scheduled for'), chalk_1.default.greenBright(time));
            node_cron_1.schedule(time, () => __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.blueBright('[CRON]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Clearing All Chats...'));
                yield this.clearAllChats();
                console.log(chalk_1.default.blueBright('[CRON]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Cleared All Chats'));
            }));
        });
        this.clearAllChats = () => __awaiter(this, void 0, void 0, function* () {
            const chats = this.chats.all();
            this.setMaxListeners(25);
            try {
                for (const chat of chats) {
                    yield this.modifyChat(chat.jid, 'clear');
                }
                return { status: 200 };
            }
            catch (err) {
                return { status: 500 };
            }
        });
        this.getLinkPreview = (link) => __awaiter(this, void 0, void 0, function* () { return Buffer.from((yield this.generateLinkPreview(link)).jpegThumbnail); });
        this.deleteQuotedMessage = (M) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!((_b = (_a = M === null || M === void 0 ? void 0 : M.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) || !M.key.remoteJid)
                return responses_json_1.default['wrong-format'];
            yield this.deleteMessage(M.key.remoteJid, {
                id: M.message.extendedTextMessage.contextInfo.stanzaId,
                remoteJid: M.key.remoteJid,
                fromMe: true
            });
            return `Sucessfully Deleted Message`;
        });
        if (this.config.cron)
            this.clearCycle(this.config.cron);
        if (process.env.ADMIN_GROUP_JID)
            this.groupMetadata(process.env.ADMIN_GROUP_JID).then((info) => info.participants.filter((u) => u.isAdmin).map((admin) => void this.config.admins.push(admin.jid)));
        this.emit('config', this.config);
    }
    getMods() {
        if (!process.env.ADMINS)
            return [];
        if (process.env.ADMINS.includes(','))
            return process.env.ADMINS.replace(/\+/g, '')
                .split(',')
                .map((num) => `${num}@s.whatsapp.net`);
        return [`${process.env.ADMINS}@s.whatsapp.net`];
    }
    getSession(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_extra_1.existsSync(`./${ID}_session.json`))
                return require(path_1.join(__dirname, '..', '..', `./${ID}_session.json`));
            const session = yield this.SessionModel.findOne({ ID });
            if (!session)
                return false;
            return session.session;
        });
    }
    updateSession(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.SessionModel.findOne({ ID });
            if (!session)
                return void (yield new this.SessionModel({ ID, session: this.base64EncodedAuthInfo() }).save());
            return void (yield this.SessionModel.updateOne({ ID }, { $set: { session: this.base64EncodedAuthInfo() } }));
        });
    }
    reply(jid, options, quote) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendMessage(jid, options.body, options.type || baileys_1.MessageType.text, {
                quoted: quote,
                caption: options.caption,
                mimetype: options.mime
            });
        });
    }
    get _config() {
        return this.config;
    }
    getUser(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.UserModel.findOne({ jid });
            if (!data)
                data = yield new this.UserModel({ jid }).save();
            return { user: this.contacts[jid], data };
        });
    }
    banUser(jid, ban) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.UserModel.findOne({ jid });
            if (!data)
                data = yield new this.UserModel({ jid }).save();
            if ((ban && data.ban) || (!ban && !data.ban))
                return false;
            yield this.UserModel.updateOne({ jid }, { $set: { ban } });
            return true;
        });
    }
    everyone(jid, metadata, admin, hidden, M) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin)
                return void this.reply(jid, { body: responses_json_1.default['no-permission'] }, M);
            const mentionedJid = metadata.participants.map((participiant) => participiant.jid);
            const text = `🎀 *${metadata.subject}* 🎀\n${hidden
                ? `🗣 *[TAGS HIDDEN]* 🗣`
                : `${responses_json_1.default.spoilers.base}\n💮 ${mentionedJid
                    .map((participiant) => `@${participiant.split('@')[0]}`)
                    .join('\n💮 ')}`}`;
            this.sendMessage(jid, text, baileys_1.MessageType.extendedText, { quoted: M, contextInfo: { mentionedJid } });
        });
    }
    getPfp(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getProfilePicture(jid);
            }
            catch (err) {
                return null;
            }
        });
    }
    banAction(chat, users, ban, M) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const user of users) {
                const { notify, vname, name } = this.contacts[user];
                const username = notify || vname || name || user.split('@')[0];
                if (!this.config.admins.includes(user)) {
                    const response = (yield this.banUser(user, ban))
                        ? ban
                            ? responses_json_1.default['banned-user']
                            : responses_json_1.default['unbanned-user']
                        : !ban
                            ? responses_json_1.default['already-unbanned']
                            : responses_json_1.default['already-banned'];
                    this.reply(chat, { body: response.replace('{U}', username) }, M);
                }
            }
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=Utils.js.map