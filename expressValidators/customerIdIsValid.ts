import mongoose from "mongoose";
import Customer from "../db/models/Customer"

const customerIdIsValid = async (value: string) => {


    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid customer-ID`);
    }

    const customer = await Customer.findOne({ _id: value });

    if (customer) {
        return true;
    }

    throw new Error('Invalid customer-ID');
}

export default customerIdIsValid;