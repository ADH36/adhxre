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
exports.start = void 0;
const Client_1 = require("./Client");
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const qr_image_1 = __importDefault(require("qr-image"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fs_extra_1 = require("fs-extra");
const Web_1 = require("./Web");
const Handler_1 = require("./Handler");
const Handler_2 = require("./Handler");
const Mongo_1 = require("./Mongo");
const start = (PORT, MONGO_URI) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client_1.Client(Mongo_1.schema.group, Mongo_1.schema.user, Mongo_1.schema.session);
    const db = mongoose_1.default.connection;
    db.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
        return console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Connected to Database'));
    }));
    yield mongoose_1.default.connect(encodeURI(MONGO_URI), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    client.logger.level = 'fatal';
    const auth = yield client.getSession(process.env.SESSION_ID || 'PROD');
    if (auth)
        client.loadAuthInfo(auth);
    const web = new Web_1.Web(client, PORT);
    web.on('web-open', (PORT) => console.log(chalk_1.default.green('[WEB]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow(`Web Server Started on`, `http://localhost:${PORT}?session=${process.env.SESSION_ID || 'PROD'} | http://localhost:${PORT}/endpoints?session=${process.env.SESSION_ID || 'PROD'}`)));
    new Web_1.BaseRoutes(client, web);
    const MessageHandler = new Handler_1.Message(client);
    const EventHandler = new Handler_2.EventHandler(client);
    //Events
    client.on('config', (config) => {
        console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Config Loaded')),
            console.table(chalk_1.default.yellow(config));
    });
    client.on('qr', (QR) => {
        web.QR = qr_image_1.default.imageSync(QR);
        console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Scan the QR Code to Proceed You can also Authenticate at'), chalk_1.default.blueBright(`http://localhost:${web.PORT}/client/qr?session=${process.env.SESSION_ID || 'PROD'}`));
    });
    client.on('open', () => {
        web.QR = null;
        console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Up and Ready to Go!'));
        client.updateSession(process.env.SESSION_ID || 'PROD');
        fs_extra_1.writeFileSync(`./${process.env.SESSION_ID || 'PROD'}_session.json`, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'));
    });
    client.on('chat-update', (update) => {
        if (!update.messages)
            return;
        const { messages } = update;
        const all = messages.all();
        const validatedMessage = MessageHandler.validate(all[0]);
        if (!validatedMessage)
            return;
        if (validatedMessage.chat === 'group')
            return void MessageHandler.handleGroupMessage(all[0]);
        return void MessageHandler.handleDirectMessage(all[0]);
    });
    client.on('chats-received', (update) => {
        if (update.hasNewChats)
            console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Chats Recived and Cached'));
    });
    client.on('contacts-received', () => {
        console.log(chalk_1.default.green('[SERVER]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellow('Contacts Recived and Cached'));
    });
    client.on('group-participants-update', (event) => EventHandler.handle(event));
    yield client.connect();
});
exports.start = start;
//# sourceMappingURL=Main.js.map