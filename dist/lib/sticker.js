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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSticker = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const createSticker = (data, crop, author = 'Xre', pack = 'WhatsApp Botto') => __awaiter(void 0, void 0, void 0, function* () {
    const sticker = new wa_sticker_formatter_1.Sticker(data, {
        crop,
        author,
        pack
    });
    yield sticker.build();
    return { body: yield sticker.get(), type: baileys_1.MessageType.sticker };
});
exports.createSticker = createSticker;
//# sourceMappingURL=sticker.js.map