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
const BankAccount_1 = __importDefault(require("./BankAccount"));
const Customer_1 = __importDefault(require("./Customer"));
const TransactionPeer_1 = __importDefault(require("./TransactionPeer"));
const TransactionSchema = new mongoose_1.Schema({
    bankAccId: {
        type: String,
        required: true
    },
    transactionPeerId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        values: [constants_1.CREDIT, constants_1.DEBIT]
    },
    amount: {
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        required: false
    },
    successStat: {
        type: String,
        values: [constants_1.SUCCESSFUL, constants_1.PENDING, constants_1.UNSUCCESSFUL],
        default: constants_1.PENDING
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
}, {
    timestamps: false
});
TransactionSchema.methods.getFields = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    const bankAcc = yield BankAccount_1.default.findOne({ _id: doc.bankAccId });
    if (bankAcc) {
        const customer = yield Customer_1.default.findOne({ _id: bankAcc.customerId });
        if (customer) {
            const transactionPeer = yield TransactionPeer_1.default.findOne({ _id: doc.transactionPeerId });
            if (transactionPeer) {
                return {
                    refNumber: doc._id,
                    bankAccId: doc.bankAccId,
                    type: doc.type,
                    amount: doc.amount,
                    remarks: doc.remarks,
                    createdAt: doc.createdAt,
                    transactionPeer: Object.assign({}, transactionPeer.getFields(transactionPeer))
                };
            }
        }
    }
    return {
        refNumber: doc._id,
        bankAccId: doc.bankAccId,
        type: doc.type,
        amoun: doc.amount
    };
});
TransactionSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const bankAccount = yield BankAccount_1.default.findOne({ _id: this.bankAccId });
        if (bankAccount) {
            bankAccount.accBalance = yield bankAccount.getBalance(bankAccount);
            yield bankAccount.save();
            return;
        }
        throw new Error(`in TransactionSchema.post: bankAccount in Transaction missing: ${yield this.getFields(this)}`);
    });
});
const Transaction = (0, mongoose_1.model)('Transaction', TransactionSchema);
exports.default = Transaction;
