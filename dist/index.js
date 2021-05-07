"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./Main");
const dotenv_1 = require("dotenv");
const Client_1 = require("./Client");
dotenv_1.config();
Client_1.validate();
const PORT = Number(process.env.PORT) || 4001;
const MONGO_URI = String(process.env.MONGO_URI) || 'mongodb://localhost/localdb';
Main_1.start(PORT, MONGO_URI);
//# sourceMappingURL=index.js.map