import { Schema, model, Document } from "mongoose";
import { GENDERS } from "../../config/constants";
import BankAccount from "./BankAccount";
import User from "./User";

export interface ICustomer {
    userId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;

}

export interface ICustomerModel extends ICustomer, Document {
    getFields: (doc: ICustomerModel) => any
}

const CustomerSchema = new Schema({
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
        values: GENDERS
    },
}, {
    timestamps: true
});

CustomerSchema.methods.getFields = async (customer: ICustomerModel) => {

    const bankAcc = await BankAccount.findOne({ customerId: customer._id });

    if (bankAcc) {
        return {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            middleName: customer.middleName,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender,
            bankAcc: await bankAcc.getFields(bankAcc)
        }

    }

    throw new Error(`Could not find user with ID: ${customer.userId}`);
}

const Customer = model<ICustomerModel>('Customer', CustomerSchema);

export default Customer;