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
exports.BaseRoutes = void 0;
const chalk_1 = __importDefault(require("chalk"));
const express_1 = require("express");
const endpoints_json_1 = __importDefault(require("../../lib/endpoints.json"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fs_extra_1 = require("fs-extra");
class BaseRoutes {
    constructor(client, web) {
        this.client = client;
        this.web = web;
        this.clientRouter = express_1.Router();
        this.auth = (req) => {
            const { query } = req;
            if (!query.session)
                return { error: `Session ID not Provided` };
            if (query.session !== (process.env.SESSION_ID || 'PROD'))
                return { error: `Session ID is invalid` };
            return true;
        };
        this.connectionOptions = ['on', 'off'];
        this.web.app.use('/client', this.clientRouter);
        this.web.app.use('/', express_1.urlencoded({ extended: false }));
        this.web.app.set('view-engine', 'ejs');
        this.web.app.post('/auth', (req, res) => {
            if (req.body.auth !== process.env.SESSION_ID)
                return res.render('index.ejs', { error: 'Incorrect Session ID', name: this.client._config.name });
            res.redirect(`/client/qr?session=${process.env.SESSION_ID}`);
        });
        this.web.app.get('/', (req, res) => res.render('index.ejs', { name: this.client._config.name }));
        this.web.app.get('/wakemydyno.txt', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.setHeader('Content-disposition', 'attachment; filename=wakemydyno.txt');
            res.setHeader('Content-type', 'text/plain');
            res.charset = 'UTF-8';
            res.send('Oneechan This Endpoint Is Not For You (づ｡◕‿‿◕｡)づ.  This is for http://wakemydyno.com/ to ping me');
        }));
        this.clientRouter.use((req, res, next) => {
            const auth = this.auth(req);
            const t = typeof auth === 'boolean';
            console.log(chalk_1.default[!t ? 'red' : 'green']('[WEB]'), chalk_1.default.blue(moment_timezone_1.default(Date.now() * 1000).format('DD/MM HH:mm:ss')), req.url);
            if (!t)
                return res.json(auth);
            next();
            this.clientRouter.get('/', (req, res) => {
                res.json({ message: 'Hi there' });
            });
            this.clientRouter.get('/qr', (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (!this.web.QR) {
                    if (this.client.state === 'open')
                        return res.json({ message: `You're already authenticated` });
                    return res.json({ message: `QR code is not generated Yet` });
                }
                res.contentType('image/png');
                return res.send(this.web.QR);
            }));
            this.clientRouter.get('/state', (req, res) => {
                res.json({ state: this.client.state });
            });
            this.web.app.get('/endpoints', (req, res) => {
                res.json(endpoints_json_1.default);
            });
            this.clientRouter.get('/config', (req, res) => {
                res.json(this.client._config);
            });
            this.clientRouter.get('/user', (req, res) => {
                const json = req.query.jid ? this.client.contacts[String(req.query.jid)] || {} : this.client.user;
                res.json(json);
            });
            this.clientRouter.get('/wa', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const query = req.query;
                if ((query === null || query === void 0 ? void 0 : query.state) === this.connectionOptions[1]) {
                    if (this.client.state === 'close')
                        return res.json({
                            message: 'The client is not connected to WhatsApp'
                        });
                    this.client.close();
                    return res.json({
                        message: 'WhatsApp Connection Has Been Closed',
                        connect: `${req.url.replace(this.connectionOptions[1], this.connectionOptions[0])}`
                    });
                }
                else if ((query === null || query === void 0 ? void 0 : query.state) === this.connectionOptions[0]) {
                    if (this.client.state === 'open')
                        return res.json({
                            message: 'The client is already connected to WhatsApp'
                        });
                    yield this.client.connect();
                    return res.json({
                        message: 'Successfully Connected to Whatsapp'
                    });
                }
                return res.json({ message: 'Invalid Query' });
            }));
            this.clientRouter.get('/session', (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (req.query.delete) {
                    const ID = process.env.SESSION_ID || 'PROD';
                    yield this.client.SessionModel.deleteOne({ ID });
                    fs_extra_1.unlinkSync(`./${ID}_session.json`);
                    return res.json({ message: 'Session Deleted' });
                }
                return res.json(this.client.base64EncodedAuthInfo());
            }));
            this.clientRouter.get('/pfp', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const auth = this.auth(req);
                if (typeof auth === 'object')
                    return res.json(auth);
                if (!req.query.id)
                    return res.json({ message: 'Not Found' });
                return res.json({ pfp: yield this.client.getPfp(req.query.id) });
            }));
        });
    }
}
exports.BaseRoutes = BaseRoutes;
//# sourceMappingURL=Base.js.map