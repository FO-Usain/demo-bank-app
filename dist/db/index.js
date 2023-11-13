"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const host = process.env.DB_SERVER;
const db = process.env.DB;
if (host && db) {
    console.log(`Attempting to connect to database ${db}`);
    mongoose_1.default.connect(`mongodb://${host}/${db}`).then(() => {
        console.log(`connected to database '${db}', successfully!!!`);
    }).catch(err => {
        console.log(`Error connecting to database: ${err}`);
    });
}
