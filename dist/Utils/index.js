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
const axios_1 = __importDefault(require("axios"));
const Embed_1 = __importDefault(require("./Embed"));
class Utils {
}
exports.default = Utils;
/* eslint-disable @typescript-eslint/no-explicit-any*/
Utils.fetch = (url, options) => __awaiter(void 0, void 0, void 0, function* () { return (yield axios_1.default.get(url, options)).data; });
Utils.download = (url) => __awaiter(void 0, void 0, void 0, function* () { return yield Utils.fetch(url, { responseType: 'arraybuffer' }); });
Utils.randomNumber = (min, max) => Math.floor(Math.random() * max) + min;
Utils.capitalize = (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
Utils.Embed = Embed_1.default;
Utils.emojies = ['📗', '👑', '⚓', '〽', '⭕', '⏳'];
Utils.urlRegExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
Utils.urlMatch = (text) => text.match(Utils.urlRegExp);
//# sourceMappingURL=index.js.map