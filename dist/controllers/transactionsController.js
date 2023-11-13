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
const Transaction_1 = __importDefault(require("../db/models/Transaction"));
class TransactionsController {
    registerTransaction(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const bankAcc = yield BankAccount_1.default.findOne({ customerId: req.body.customerId });
            if (bankAcc) {
                const transaction = yield Transaction_1.default.create({
                    bankAccId: bankAcc._id,
                    transactionPeerId: req.body.peerId,
                    type: req.body.type,
                    amount: req.body.amount,
                    remarks: (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.remarks) !== null && _b !== void 0 ? _b : 'For business',
                    successStat: constants_1.SUCCESSFUL,
                    createdAt: req.body.date
                });
                if (transaction) {
                    res.status(200).send(Object.assign({}, yield transaction.getFields(transaction)));
                }
            }
        });
    }
    getTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
const transactionsController = new TransactionsController();
exports.default = transactionsController;
