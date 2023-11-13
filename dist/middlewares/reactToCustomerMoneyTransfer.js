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
const Customer_1 = __importDefault(require("../db/models/Customer"));
const helpers_1 = require("../helpers");
const reactToCustomerMoneyTransfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //pre-condition: User role is Customer
    const authToken = (0, helpers_1.extractAuthToken)(req);
    if (authToken) {
        const userId = (0, helpers_1.decodeJWT)(authToken).userId;
        const customer = yield Customer_1.default.findOne({ userId });
        if (customer) {
            // customer.moneyTransferCount = customer.moneyTransferCount as number + 1;
            if (yield customer.save()) {
                //everywhere good!
                next();
                return;
            }
        }
    }
});
exports.default = reactToCustomerMoneyTransfer;
