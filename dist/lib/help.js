"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const commands_json_1 = __importDefault(require("./commands.json"));
const Utils_1 = __importDefault(require("../Utils"));
const responses_json_1 = __importDefault(require("./responses.json"));
const help = (client, command) => {
    if (command) {
        for (const catogary in commands_json_1.default) {
            for (const index of commands_json_1.default[catogary]) {
                if (index.command === command) {
                    return `*📗 Command:* ${index.command}\n📙 *Description:* ${index.description}\n📘 *Usage:* ${client._config.prefix}${index.usage}`;
                }
            }
        }
        return responses_json_1.default['invalid-command-short'].replace('{C}', command);
    }
    let base = `🤖 ${client._config.name} Command List 🤖\n\n💡 *Prefix:* ${client._config.prefix}\n\n`;
    const cmds = commands_json_1.default;
    const cats = Object.keys(cmds);
    for (const cat in cmds) {
        base += `*${Utils_1.default.capitalize(cat)}* ${Utils_1.default.emojies[cats.indexOf(cat)]}\n\`\`\``;
        cmds[cat].forEach((cmd) => {
            base += `${cmd.command}${cmds[cat][cmds[cat].length - 1] === cmd ? '' : ', '}`;
        });
        base += '```\n\n';
    }
    return `${base}📚 Use ${client._config.prefix}help <command_name> to view the full info. \n🔖 _Eg: ${client._config.prefix}help promote_`;
};
exports.help = help;
//# sourceMappingURL=help.js.map