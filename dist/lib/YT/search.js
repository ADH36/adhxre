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
exports.ytSreach = void 0;
const yt_search_1 = __importDefault(require("yt-search"));
const responses_json_1 = __importDefault(require("../responses.json"));
const ytSreach = (term) => __awaiter(void 0, void 0, void 0, function* () {
    if (!term)
        return responses_json_1.default['wrong-format'];
    const { videos } = yield yt_search_1.default(term);
    if (!videos || videos.length <= 0)
        return responses_json_1.default['no-search-results'].replace('{T}', term);
    const length = videos.length < 10 ? videos.length : 10;
    let base = `Search Term: *${term}*\n\n🔎 *Results*\n\n`;
    for (let i = 0; i < length; i++) {
        base += `#${i + 1}\n📗 *Title:* ${videos[i].title}\n📙 *Description:* ${videos[i].description.slice(50)}\n📘 *URL:* ${videos[i].url}\n\n`;
    }
    return base;
});
exports.ytSreach = ytSreach;
//# sourceMappingURL=search.js.map