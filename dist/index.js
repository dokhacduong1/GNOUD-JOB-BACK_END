"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const database = __importStar(require("./config/database"));
const index_routes_1 = __importDefault(require("./api/v1/routes/admins/index.routes"));
const index_routes_2 = __importDefault(require("./api/v1/routes/clients/index.routes"));
const index_routes_3 = __importDefault(require("./api/v1/routes/employers/index.routes"));
const index_routes_4 = __importDefault(require("./api/v1/routes/locations/index.routes"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const index_socket_routes_1 = __importDefault(require("./socket/v1/routes/all/index-socket.routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
    }
});
(0, index_socket_routes_1.default)(io);
app.set('socketio', io);
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"]
}));
dotenv_1.default.config();
database.connect();
(0, index_routes_1.default)(app);
(0, index_routes_2.default)(app);
(0, index_routes_3.default)(app);
(0, index_routes_4.default)(app);
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`App Listening On Port ${port}`);
});
