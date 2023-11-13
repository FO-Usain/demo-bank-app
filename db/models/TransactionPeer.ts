import { Schema, model, Document } from "mongoose";

interface ITransactionPeer {
    customerId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    bankName: string;
    accountNumber: string;
    isBeneficiary: boolean;
    isVisible: boolean;     //Important on if this ITransactionPeer is a Beneficiary of the concerned Customer
}

export interface ITransactionPeerModel extends ITransactionPeer, Document {
    getFields: (arg: ITransactionPeerModel) => any
}

const TransactionPeerSchema = new Schema({
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

TransactionPeerSchema.methods.getFields = (arg: ITransactionPeerModel) => {
    return {
        id: arg._id,
        firstName: arg.firstName,
        lastName: arg.lastName,
        middleName: arg.middleName,
        bankName: arg.bankName,
        accountNumber: arg.accountNumber,
    }
}

const TransactionPeer = model<ITransactionPeerModel>('TransactionPeer', TransactionPeerSchema);

export default TransactionPeer;