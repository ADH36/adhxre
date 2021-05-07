"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    },
    session: {
        type: Object,
        required: false,
        unique: true
    }
});
exports.session = mongoose_1.model('session', SessionSchema);
//# sourceMappingURL=Session.js.map