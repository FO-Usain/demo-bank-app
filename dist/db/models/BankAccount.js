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
const mongoose_1 = require("mongoose");
const constants_1 = require("../../config/constants");
const Transaction_1 = __importDefault(require("./Transaction"));
const BankAccountSchema = new mongoose_1.Schema({
    customerId: {
        type: String,
        required: true
    },
    accType: {
        type: String,
        required: true,
        values: constants_1.ACC_TYPES
    },
    accNumber: {
        type: String,
        required: true,
        unique: true
    },
    accBalance: {
        type: Number,
        required: true,
        default: 0.00
    },
    maxMoneyTransferCount: {
        type: Number,
        required: true
    },
    moneyTransferCount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});
BankAccountSchema.methods.getFields = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        id: doc._id,
        accType: doc.accType,
        accNumber: doc.accNumber,
        accBalance: doc.accBalance,
    };
});
BankAccountSchema.methods.getBalance = (bankAcc) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_1.default.find({ bankAccId: bankAcc._id });
    if (transactions) {
        let netCredit = 0;
        for (const transaction of transactions) {
            if (transaction.type === constants_1.CREDIT) {
                netCredit += Number(transaction.amount);
            }
            else if (transaction.type === constants_1.DEBIT) {
                netCredit -= Number(transaction.amount);
            }
        }
        return netCredit;
    }
    throw new Error('in BankAccountSchema.methods.getBalance');
});
const BankAccount = (0, mongoose_1.model)('BankAccount', BankAccountSchema);
exports.default = BankAccount;
