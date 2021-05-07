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
exports.lyrics = void 0;
const responses_json_1 = __importDefault(require("./responses.json"));
const Utils_1 = __importDefault(require("../Utils"));
const lyrics = (term) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.EIF)
        return responses_json_1.default.warinings.EIF;
    if (!term)
        responses_json_1.default['empty-query'];
    const data = yield Utils_1.default.fetch(`${process.env.EIF}/lyrics?term=${encodeURI(term)}`, {});
    return data.status !== 200
        ? data.error
        : responses_json_1.default.lyrics.replace(`{T}`, Utils_1.default.capitalize(data.term)).replace(`{L}`, data.lyrics);
});
exports.lyrics = lyrics;
//# sourceMappingURL=lyrics.js.map