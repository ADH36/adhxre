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
exports.wSearch = exports.getWById = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const responses_json_1 = __importDefault(require("./responses.json"));
const Utils_1 = __importDefault(require("../Utils"));
const getWById = (id, type = 'character') => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return { body: responses_json_1.default['empty-query'] };
    try {
        const r = yield Utils_1.default.fetch(`https://api.jikan.moe/v3/${type}/${id}`, {});
        const sim = r;
        const n = type !== 'character'
            ? r.score
            : sim.animeography[0]
                ? sim.animeography[0]['name']
                : sim.mangaography[0]['name'];
        const dt = `📙 *${type === 'anime' || type === 'manga' ? 'Title' : 'Name'}:* ${sim[type === 'manga' || type === 'anime' ? 'title' : 'name']}\n\n🔖 *ID:* ${sim.mal_id}\n\n☄ *${type === 'anime' || type === 'manga' ? 'Rating' : 'Series'}: ${n}*\n\n❄️ ${type === 'anime' || type === 'manga'
            ? `*Synopsis:* ${sim.synopsis.replace(/\\n/g, '')}`
            : `*About:* ${sim.About.replace(/\\n/g, '')}`}\n\n🌐 *URL:* ${sim.url}`;
        return {
            caption: dt,
            body: yield Utils_1.default.download(sim.image_url),
            type: baileys_1.MessageType.image
        };
    }
    catch (err) {
        return { body: `Couldn't find *${id}*` };
    }
});
exports.getWById = getWById;
const wSearch = (q, preifx, type = 'character') => __awaiter(void 0, void 0, void 0, function* () {
    if (!q)
        return { body: responses_json_1.default['empty-query'] };
    try {
        const res = yield Utils_1.default.fetch(`https://api.jikan.moe/v3/search/${type}?q=${q}`, {});
        let z = `🎋 *${Utils_1.default.capitalize(type)} Search* 🎋\n\n`;
        const sim = res.results;
        let n = 10;
        if (sim.length < 10)
            n = sim.length;
        for (let i = 0; i < n; i++) {
            z += `📗 *${type === 'anime' || type === 'manga' ? `Title:* ${sim[i].title}` : `Name:* ${sim[i].name}`}:\n🌐 *URL:* ${sim[i].url}\n🎀 *Full Info:* ${preifx}${type === 'anime' ? 'aid' : type === 'manga' ? 'mid' : 'chid'} ${sim[i].mal_id}\n\n`;
        }
        return {
            caption: z,
            body: yield Utils_1.default.download(sim[0].image_url),
            type: baileys_1.MessageType.image
        };
    }
    catch (err) {
        return { body: "Couldn't find" };
    }
});
exports.wSearch = wSearch;
//# sourceMappingURL=anime.js.map