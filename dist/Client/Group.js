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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const lib_1 = require("../lib");
const ML_1 = require("./ML");
class Client extends ML_1.Client {
    constructor() {
        super(...arguments);
        this.group = new lib_1.GroupEx(this);
    }
    getGroupInfo(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.groupMetadata(jid);
            const admins = [];
            metadata.participants.forEach((user) => (user.isAdmin ? admins.push(user.jid) : ''));
            let data = yield this.GroupModel.findOne({ jid });
            if (!data)
                data = yield new this.GroupModel({ jid }).save();
            return { metadata, admins, data };
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=Group.js.map