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
const constants_1 = require("../config/constants");
const BankAccount_1 = __importDefault(require("../db/models/BankAccount"));
const Customer_1 = __importDefault(require("../db/models/Customer"));
const User_1 = __importDefault(require("../db/models/User"));
/**
 * Killed Customer is the customer that reach his/her maximum number of transfers
 * @param req
 * @param res
 * @param next
 */
const stopKilledCustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield User_1.default.findOne({ email });
    if (user && user.role === constants_1.CUSTOMER) {
        const customer = yield Customer_1.default.findOne({ userId: user._id });
        if (customer) {
            const bankAcc = yield BankAccount_1.default.findOne({ customerId: customer._id });
            if (bankAcc && (Number(bankAcc.moneyTransferCount) >= Number(bankAcc.maxMoneyTransferCount))) {
                res.status(400).send({
                    err: 'Your account has been temporarily frozen, due to some recent unusual activities. Visit our closest branch to get this resolved.',
                    errCode: constants_1.ERR_KILLED
                });
                return;
            }
        }
    }
    next();
});
exports.default = stopKilledCustomerLogin;
