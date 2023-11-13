import mongoose from "mongoose";
import Customer from "../db/models/Customer";

const mkCustomerExists = (field: string) => {

    return async (value: string) => {

        if (field === '_id') {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid value.`);
            }
        }

        if (await Customer.findOne({
            [field]: value
        })) {
            return true;
        }

        throw new Error('Invalid value.');
    }
}

export default mkCustomerExists;