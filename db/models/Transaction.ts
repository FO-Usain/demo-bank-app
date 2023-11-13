import { Schema, model, Document } from "mongoose";
import { CREDIT, DEBIT, PENDING, SUCCESSFUL, TRANSACTION_TYPES, UNSUCCESSFUL } from "../../config/constants";
import BankAccount from "./BankAccount";
import Customer from "./Customer";
import TransactionPeer from "./TransactionPeer";

export interface ITransaction {
    bankAccId: string;
    transactionPeerId: string;

    type: string;       //credit or debit
    amount: number;
    remarks: string;     //short note made by customer to describe this Transaction,
    successStat: string;    //success, pending, or unsuccessful

    createdAt: Date;
}

export interface ITransactionFields {
    refNumber: string;
    bankAccId: string;
    type: string;
    amount: string;
    remarks: string;
    createdAt: string;

    transactionPeer: {
        firstName: string;
        lastName: string;
        middleName: string;
        bankName: string;
        accountNumber: string;
    }
}


export interface ITransactionModel extends ITransaction, Document {

    getFields: (doc: ITransactionModel) => any

}

const TransactionSchema = new Schema({
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
        values: [CREDIT, DEBIT]
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
        values: [SUCCESSFUL, PENDING, UNSUCCESSFUL],
        default: PENDING
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
}, {
    timestamps: false
});

TransactionSchema.methods.getFields = async (doc: ITransactionModel) => {

    const bankAcc = await BankAccount.findOne({ _id: doc.bankAccId });

    if (bankAcc) {
        const customer = await Customer.findOne({ _id: bankAcc.customerId });

        if (customer) {
            const transactionPeer = await TransactionPeer.findOne({ _id: doc.transactionPeerId });

            if (transactionPeer) {
                return {
                    refNumber: doc._id,
                    bankAccId: doc.bankAccId,
                    type: doc.type,
                    amount: doc.amount,
                    remarks: doc.remarks,
                    createdAt: doc.createdAt,

                    transactionPeer: {
                        ...transactionPeer.getFields(transactionPeer)
                    }
                }
            }
        }
    }

    return {
        refNumber: doc._id,
        bankAccId: doc.bankAccId,
        type: doc.type,
        amoun: doc.amount
    }
}

TransactionSchema.post('save', async function (this: ITransactionModel) {

    const bankAccount = await BankAccount.findOne({ _id: this.bankAccId });

    if (bankAccount) {

        bankAccount.accBalance = await bankAccount.getBalance(bankAccount);

        await bankAccount.save();
        return;
    }

    throw new Error(`in TransactionSchema.post: bankAccount in Transaction missing: ${await this.getFields(this)}`);

})

const Transaction = model<ITransactionModel>('Transaction', TransactionSchema);

export default Transaction;