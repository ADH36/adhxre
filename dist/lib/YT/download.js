"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getYTMediaFromUrl = exports.download = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const fs_extra_1 = require("fs-extra");
const os_1 = require("os");
const ytdl_core_1 = __importStar(require("ytdl-core"));
const responses_json_1 = __importDefault(require("../responses.json"));
const download = (url, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ytdl_core_1.validateURL(url))
        return responses_json_1.default['invalid-url'].replace('{W}', 'YT').replace('{U}', url);
    const video = type === 'video';
    let filename = `${os_1.tmpdir()}/${Math.random().toString(30)}.${video ? 'mp4' : 'mp3'}`;
    const { videoDetails: info } = yield ytdl_core_1.getInfo(url);
    if (Number(info.lengthSeconds) > 600)
        return responses_json_1.default['video-duration-clause'];
    const stream = fs_extra_1.createWriteStream(filename);
    ytdl_core_1.default(url, { quality: !video ? 'highestaudio' : 'highest' }).pipe(stream);
    filename = yield new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filename));
        stream.on('error', (err) => reject(err && console.log(err)));
    });
    const caption = `📗 *Title:* ${info.title}\n📙 *Description:* ${info.description}\n📘 *Author:* ${info.author}`;
    return { body: yield fs_extra_1.readFile(filename), caption, mime: video ? baileys_1.Mimetype.mp4 : baileys_1.Mimetype.mp4Audio };
});
exports.download = download;
const getYTMediaFromUrl = (url, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url)
        return { body: responses_json_1.default['wrong-format'] };
    const media = yield exports.download(url, type);
    if (typeof media === 'string')
        return { body: media };
    return Object.assign(Object.assign({}, media), { type: type === 'audio' ? baileys_1.MessageType.audio : baileys_1.MessageType.video });
});
exports.getYTMediaFromUrl = getYTMediaFromUrl;
//# sourceMappingURL=download.js.map