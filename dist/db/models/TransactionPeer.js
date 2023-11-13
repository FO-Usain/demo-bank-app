"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionPeerSchema = new mongoose_1.Schema({
    customerId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    isBeneficiary: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
TransactionPeerSchema.methods.getFields = (arg) => {
    return {
        id: arg._id,
        firstName: arg.firstName,
        lastName: arg.lastName,
        middleName: arg.middleName,
        bankName: arg.bankName,
        accountNumber: arg.accountNumber,
    };
};
const TransactionPeer = (0, mongoose_1.model)('TransactionPeer', TransactionPeerSchema);
exports.default = TransactionPeer;
