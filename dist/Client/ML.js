"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const lib_1 = require("../lib");
const Utils_1 = require("./Utils");
class Client extends Utils_1.Client {
    constructor() {
        super(...arguments);
        this.ML = {
            nsfw: new lib_1.MlNsfw()
        };
    }
}
exports.Client = Client;
//# sourceMappingURL=ML.js.map