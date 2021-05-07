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
exports.toggleableGroupActions = exports.GroupEx = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const Utils_1 = __importDefault(require("../Utils"));
const responses_json_1 = __importDefault(require("./responses.json"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
class GroupEx {
    constructor(client) {
        this.client = client;
        this.toggleEvent = (chat, contacts, uia, xim, type) => __awaiter(this, void 0, void 0, function* () {
            if (!uia)
                return { body: responses_json_1.default['user-lacks-permission'] };
            if (!xim)
                return { body: responses_json_1.default['no-permission'] };
            if (contacts.length === 0)
                return { body: responses_json_1.default['wrong-format'] };
            let mod = { status: 0 };
            switch (type) {
                case 'demote':
                    mod = yield this.client.groupDemoteAdmin(chat, contacts);
                    break;
                case 'promote':
                    mod = yield this.client.groupMakeAdmin(chat, contacts);
                    break;
                case 'remove':
                    contacts.map((user) => __awaiter(this, void 0, void 0, function* () { return yield this.client.groupRemove(chat, [user]); }));
            }
            return {
                body: `Execution Successful\n\n${Utils_1.default.capitalize(type)}:\n${!mod.participants
                    ? contacts
                        .map((user) => {
                        const conatct = this.client.contacts[user];
                        return (conatct === null || conatct === void 0 ? void 0 : conatct.notify) || (conatct === null || conatct === void 0 ? void 0 : conatct.vname) || (conatct === null || conatct === void 0 ? void 0 : conatct.name) || user.split('@')[0];
                    })
                        .join('\n')
                    : mod === null || mod === void 0 ? void 0 : mod.participants.map((user) => {
                        var _a;
                        const key = (_a = Object.keys(user)) === null || _a === void 0 ? void 0 : _a[0];
                        if (!key || user[key].code < 200)
                            return '';
                        const conatct = this.client.contacts[key];
                        return (conatct === null || conatct === void 0 ? void 0 : conatct.notify) || (conatct === null || conatct === void 0 ? void 0 : conatct.vname) || (conatct === null || conatct === void 0 ? void 0 : conatct.name) || key.split('@')[0];
                    }).join('\n')}`
            };
        });
        this.register = (admin, chat, register, type) => __awaiter(this, void 0, void 0, function* () {
            if (!admin)
                return { body: responses_json_1.default['user-lacks-permission'] };
            if (!Object.values(toggleableGroupActions).includes(type))
                return { body: responses_json_1.default['invalid-group-action'].replace('{A}', type) };
            if (register && chat[type])
                return {
                    body: responses_json_1.default[register ? 'already-enabled' : 'not-enabled'].replace('{T}', Utils_1.default.capitalize(type))
                };
            yield this.client.GroupModel.updateOne({ jid: chat.jid }, { $set: { [type]: register } });
            return {
                body: responses_json_1.default[register ? 'enable-sucessful' : 'disable-successful'].replace('{T}', Utils_1.default.capitalize(type))
            };
        });
        this.join = (text, mod, username = 'User') => __awaiter(this, void 0, void 0, function* () {
            const regExec = Utils_1.default.urlMatch(text);
            if (!regExec)
                return { body: responses_json_1.default['no-url-provided'] };
            if (!mod) {
                if (process.env.ADMIN_GROUP_JID || this.client._config.admins[0]) {
                    void (yield this.client.reply(process.env.ADMIN_GROUP_JID || this.client._config.admins[0], {
                        body: responses_json_1.default['join-request'].replace('{A}', username).replace('{L}', regExec[0])
                    }));
                    return { body: responses_json_1.default['join-req-forwarded'] };
                }
                else
                    return { body: responses_json_1.default['cannot-process-request'] };
            }
            else {
                try {
                    const all = this.client.chats.all().map((chat) => chat.jid);
                    const group = yield this.client.acceptInvite(regExec[0].split('m/')[1]);
                    if (group === null || group === void 0 ? void 0 : group.gid) {
                        const metadata = yield this.client.groupMetadata(group.gid);
                        return {
                            body: all.includes(group.gid)
                                ? `Already in ${metadata.subject}`
                                : `🎊 Sucessfully Joined!\n\n🎋 *Title:* ${metadata.subject}\n🏊 *Participiants:* ${metadata.participants.length}\n📑 *Description:* ${metadata.desc}\n👑 *Created By:* ${metadata.owner}`
                        };
                    }
                    return { body: responses_json_1.default['failed-to-join'] };
                }
                catch (err) {
                    console.log(err);
                    return { body: responses_json_1.default['failed-to-join'] };
                }
            }
        });
        this.simplifiedGroupInfo = (info) => __awaiter(this, void 0, void 0, function* () {
            const { metadata, data } = info;
            const [mod, safe, events, NSFW, icon] = [
                (data === null || data === void 0 ? void 0 : data.mod) || false,
                (data === null || data === void 0 ? void 0 : data.safe) || false,
                (data === null || data === void 0 ? void 0 : data.events) || false,
                (data === null || data === void 0 ? void 0 : data.nsfw) || false,
                yield this.client.getPfp(metadata.id)
            ];
            const owner = this.client.contacts[metadata.owner];
            return {
                body: icon ? yield Utils_1.default.download(icon) : yield fs_extra_1.readFile(path_1.join(this.client.assets, 'images', 'yui.jpg')),
                caption: `💮 *Title:* ${metadata.subject}\n\n👑 *Created By:* ${(owner === null || owner === void 0 ? void 0 : owner.notify) || (owner === null || owner === void 0 ? void 0 : owner.vname) || (owner === null || owner === void 0 ? void 0 : owner.name) || metadata.owner.split('@')[0]}\n\n📅 *Created On:* ${moment_timezone_1.default(metadata.creation * 1000).format('DD/MM HH:mm:ss')}\n\n🔊 *Announce:* ${metadata.announce || false}\n\n🍀 *Restricted:* ${metadata.restrict || metadata.restrict || false}\n\n🏊 *Participiants:* ${metadata.participants.length}\n\n🏅 *Admins:* ${metadata.participants.filter((participiant) => participiant.isAdmin).length}\n\n🎯 *Moderation:* ${mod}\n\n🔮 *Events:* ${events}\n\n🌟 *Safe:* ${safe}\n\n🔞 *NSFW:* ${NSFW}\n\n〽 *Description:* \n${metadata.desc}`,
                type: baileys_1.MessageType.image
            };
        });
        this.announce = (metadata, admin, me, announce) => __awaiter(this, void 0, void 0, function* () {
            if (!admin)
                return { body: responses_json_1.default['user-lacks-permission'] };
            if (!me)
                return { body: responses_json_1.default['no-permission'] };
            if (!announce && !metadata.announce)
                return { body: `The group is already open` };
            if (announce && metadata.announce)
                return { body: `The group is already closed` };
            yield this.client.groupSettingChange(metadata.id, baileys_1.GroupSettingChange.messageSend, announce);
            return { body: `The group is now ${announce ? 'Closed' : 'Opened'}` };
        });
        this.purge = (metadata, sender, me) => __awaiter(this, void 0, void 0, function* () {
            if (metadata.owner !== sender && metadata.owner !== sender.replace('s.whatsapp.net', 'c.us'))
                return { body: responses_json_1.default['not-owner'] };
            if (!me)
                return { body: responses_json_1.default['no-permission'] };
            if (!this.purgeSet.has(metadata.id)) {
                this.addToPurge(metadata.id);
                return { body: responses_json_1.default.warinings.purge };
            }
            const participants = metadata.participants.map((user) => user.jid);
            for (const user of participants) {
                if (!(user === metadata.owner || user === this.client.user.jid))
                    yield this.client.groupRemove(metadata.id, [user]);
            }
            return { body: 'Done!' };
        });
        this.purgeSet = new Set();
        this.addToPurge = (id) => __awaiter(this, void 0, void 0, function* () {
            this.purgeSet.add(id);
            setTimeout(() => this.purgeSet.delete(id), 60000);
        });
    }
}
exports.GroupEx = GroupEx;
var toggleableGroupActions;
(function (toggleableGroupActions) {
    toggleableGroupActions["events"] = "events";
    toggleableGroupActions["NSFW"] = "nsfw";
    toggleableGroupActions["safe"] = "safe";
    toggleableGroupActions["mod"] = "mod";
})(toggleableGroupActions = exports.toggleableGroupActions || (exports.toggleableGroupActions = {}));
//# sourceMappingURL=group.js.map