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
exports.reddit = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Utils_1 = __importDefault(require("../Utils"));
const responses_json_1 = __importDefault(require("./responses.json"));
const reddit = (subreddit, safe) => __awaiter(void 0, void 0, void 0, function* () {
    if (!subreddit)
        return { body: responses_json_1.default['wrong-format'] };
    try {
        const post = yield Utils_1.default.fetch(`https://meme-api.herokuapp.com/gimme/${encodeURI(subreddit.trim())}`, {});
        if (post.nsfw && safe)
            return {
                body: yield fs_extra_1.readFile(path_1.join(__dirname, '..', '..', 'assets', 'images', '18+.jpg')),
                caption: responses_json_1.default.mod['no-nsfw'],
                type: baileys_1.MessageType.image
            };
        return {
            body: yield Utils_1.default.download(post.url),
            caption: `📗 *Title:* ${post.title}\n📘 *Author:* ${post.author}\n📙 *Post:* ${post.postLink}`,
            type: baileys_1.MessageType.image
        };
    }
    catch (err) {
        return {
            body: `🎯 *The given subreddit possibly is Invalid or this subreddit does not have any posts containing images*`
        };
    }
});
exports.reddit = reddit;
//# sourceMappingURL=reddit.js.map