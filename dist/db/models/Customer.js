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
const CustomerSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        values: constants_1.GENDERS
    },
}, {
    timestamps: true
});
CustomerSchema.methods.getFields = (customer) => __awaiter(void 0, void 0, void 0, function* () {
    const bankAcc = yield BankAccount_1.default.findOne({ customerId: customer._id });
    if (bankAcc) {
        return {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            middleName: customer.middleName,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender,
            bankAcc: yield bankAcc.getFields(bankAcc)
        };
    }
    throw new Error(`Could not find user with ID: ${customer.userId}`);
});
const Customer = (0, mongoose_1.model)('Customer', CustomerSchema);
exports.default = Customer;
