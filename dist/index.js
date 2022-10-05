"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// configurations
dotenv_1.default.config();
require("./config/mongoose");
require("./config/redis");
const app_route_1 = __importDefault(require("./modules/app/app.route"));
// Boot express
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const base = (_a = process.env.base_url) !== null && _a !== void 0 ? _a : "/api/v1";
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Application routing
app.get("/", (req, res) => {
    res.status(200).send({ data: "HI TEST APPLICATION" });
});
app.use(base, app_route_1.default);
// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
// Handle unhandled promise rejections and exceptions
process.on("unhandledRejection", (err) => {
    console.log(err);
});
process.on("uncaughtException", (err) => {
    console.log(err.message);
});
