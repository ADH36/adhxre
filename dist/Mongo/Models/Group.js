"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
const mongoose_1 = require("mongoose");
const GroupSchema = new mongoose_1.Schema({
    jid: {
        type: String,
        required: true,
        unique: true
    },
    events: {
        type: Boolean,
        required: false,
        default: false
    },
    nsfw: {
        type: Boolean,
        required: false,
        default: false
    },
    safe: {
        type: Boolean,
        required: false,
        default: false
    },
    mod: {
        type: Boolean,
        required: false,
        default: false
    }
});
exports.group = mongoose_1.model('groups', GroupSchema);
//# sourceMappingURL=Group.js.map