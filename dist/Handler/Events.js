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
exports.EventHandler = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const chalk_1 = __importDefault(require("chalk"));
const Utils_1 = __importDefault(require("../Utils"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class EventHandler {
    constructor(client) {
        this.client = client;
        this.handle = (event) => __awaiter(this, void 0, void 0, function* () {
            const group = yield this.client.getGroupInfo(event.jid);
            if (!group.data.events)
                return;
            console.log(chalk_1.default.green('[EVENT]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.blueBright(event.action), chalk_1.default.yellow('in'), chalk_1.default.blueBright(group.metadata.subject));
            if (event.action === 'add')
                return void this.add(event, group);
            if (event.action === 'remove')
                return this.leave(event);
        });
        this.add = (event, group) => __awaiter(this, void 0, void 0, function* () {
            const participiants = event.participants.map((user) => {
                var _a, _b, _c, _d, _e, _f;
                return `${((_b = (_a = this.client.contacts) === null || _a === void 0 ? void 0 : _a[user]) === null || _b === void 0 ? void 0 : _b['notify']) ||
                    ((_d = (_c = this.client.contacts) === null || _c === void 0 ? void 0 : _c[user]) === null || _d === void 0 ? void 0 : _d['vname']) ||
                    ((_f = (_e = this.client.contacts) === null || _e === void 0 ? void 0 : _e[user]) === null || _f === void 0 ? void 0 : _f['name']) ||
                    user.split('@')[0]} `;
            });
            const picture = yield this.client.getPfp(event.jid);
            const text = `Welcome to ${group.metadata.subject}\n\n${group.metadata.desc}\n\n${participiants}`;
            if (picture)
                return void this.client.sendMessage(event.jid, yield Utils_1.default.download(picture), baileys_1.MessageType.image, {
                    caption: text
                });
            return void this.client.sendMessage(event.jid, text, baileys_1.MessageType.text);
        });
        this.leave = (event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const user = event.participants[0];
            return void this.client.sendMessage(event.jid, `Goodbye ${((_b = (_a = this.client.contacts) === null || _a === void 0 ? void 0 : _a[user]) === null || _b === void 0 ? void 0 : _b['notify']) ||
                ((_d = (_c = this.client.contacts) === null || _c === void 0 ? void 0 : _c[user]) === null || _d === void 0 ? void 0 : _d['vname']) ||
                ((_f = (_e = this.client.contacts) === null || _e === void 0 ? void 0 : _e[user]) === null || _f === void 0 ? void 0 : _f['name']) ||
                user.split('@')[0]}`, baileys_1.MessageType.text);
        });
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=Events.js.map