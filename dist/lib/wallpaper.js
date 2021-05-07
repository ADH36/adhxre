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
exports.wallpaper = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const anime_wallpaper_1 = require("anime-wallpaper");
const Utils_1 = __importDefault(require("../Utils"));
const responses_json_1 = __importDefault(require("./responses.json"));
const wallClient = new anime_wallpaper_1.AnimeWallpaper();
const alphacoders = (term) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Utils_1.default.download((yield wallClient.getAnimeWall1({ search: term, page: 1 }))[0].image);
    }
    catch (err) {
        return null;
    }
});
const wallpapercave = (term) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return Utils_1.default.download((yield wallClient.getAnimeWall2(term))[0].image);
    }
    catch (err) {
        return null;
    }
});
const wallpaper = (term) => __awaiter(void 0, void 0, void 0, function* () {
    if (!term)
        return { body: responses_json_1.default['wrong-format'] };
    const alpha = yield alphacoders(term);
    if (alpha)
        return { body: alpha, type: baileys_1.MessageType.image };
    const cave = yield wallpapercave(term);
    if (cave)
        return { body: cave, type: baileys_1.MessageType.image };
    return { body: responses_json_1.default['no-search-results'].replace('{T}', term) };
});
exports.wallpaper = wallpaper;
//# sourceMappingURL=wallpaper.js.map