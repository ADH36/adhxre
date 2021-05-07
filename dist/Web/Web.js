"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web = void 0;
const express_1 = __importDefault(require("express"));
const events_1 = require("events");
class Web extends events_1.EventEmitter {
    constructor(client, PORT) {
        super();
        this.client = client;
        this.PORT = PORT;
        this.QR = null;
        this.app = express_1.default();
        this.app.listen(this.PORT, () => this.emit('web-open', this.PORT));
    }
}
exports.Web = Web;
//# sourceMappingURL=Web.js.map