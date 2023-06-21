"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/test", function (req, res) {
    res.send("SEZIONE SUPER SEGRETA");
});
app.get("/", function (req, res) {
    res.send("Home page");
});
mongoose_1.default.connect('mongodb://mean_mongo:27017')
    .then(() => {
    console.log('connected to mongoDB');
});
app.listen(3080, () => console.log('\n\nHTTP server UP & RUNNING\n\n'));
