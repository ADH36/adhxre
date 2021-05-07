"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const chalk_1 = __importDefault(require("chalk"));
const validate = () => {
    const missing = [];
    if (!process.env.SESSION_ID)
        missing.push('SESSION_ID');
    if (!process.env.MONGO_URI)
        missing.push('MONGO_URI');
    if (missing.length > 0) {
        console.log(chalk_1.default.redBright(`[${missing.length}] Missing Config Vars`), chalk_1.default.yellow(`\nSpecfiy the following config vars in your ".env" file or add them to your env variables`), chalk_1.default.blue(`\n${missing.join('\n')}`), chalk_1.default.green(`\nNeed help? Read the self-hosting guide. https://github.com/Synthesized-Infinity/Whatsapp-Botto-Xre/blob/master/Self-Hosting.md`));
        process.exit();
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map