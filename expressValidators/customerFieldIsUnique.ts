import mongoose from "mongoose";
import Customer from "../db/models/Customer"

const mkCustomerFieldIsUnique = (field: string) => {

    return async (value: string) => {

        if (field === '_id') {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid value.`);
            }
        }

        if (await Customer.findOne({
            [field]: value
        })) {
            throw new Error(`"${value}" has already been chosen. Please, try another value`);
        }
    }
}

export default mkCustomerFieldIsUnique;