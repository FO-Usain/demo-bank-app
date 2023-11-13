import { Schema, model, Document } from "mongoose";
import { ACC_TYPES, CREDIT, DEBIT } from "../../config/constants";
import Transaction from "./Transaction";

export interface IBankAccount {
    customerId: string;
    accType: string;
    accNumber: string;
    accBalance: number;

    maxMoneyTransferCount: Number;       //The maximum number of money-transfers this Customer is allowed to have
    moneyTransferCount: Number;     //The current number of money-transfers this Customer currently has.

    createAt: Date;
    updatedAt: Date;
}

export interface IBankAccountModel extends IBankAccount, Document {
    getFields: (doc: IBankAccountModel) => any;
    getBalance: (bankAcc: IBankAccountModel) => number;
}

const BankAccountSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    accType: {
        type: String,
        required: true,
        values: ACC_TYPES
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

BankAccountSchema.methods.getFields = async (doc: IBankAccountModel) => {
    return {
        id: doc._id,
        accType: doc.accType,
        accNumber: doc.accNumber,
        accBalance: doc.accBalance,
    }
}

BankAccountSchema.methods.getBalance = async (bankAcc: IBankAccountModel): Promise<number> => {
    const transactions = await Transaction.find({ bankAccId: bankAcc._id });

    if (transactions) {

        let netCredit = 0;

        for (const transaction of transactions) {

            if (transaction.type === CREDIT) {
                netCredit += Number(transaction.amount);
            } else if (transaction.type === DEBIT) {
                netCredit -= Number(transaction.amount);
            }

        }
        
        return netCredit;
    }

    throw new Error('in BankAccountSchema.methods.getBalance');
}

const BankAccount = model<IBankAccountModel>('BankAccount', BankAccountSchema);

export default BankAccount;