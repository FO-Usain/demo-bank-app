import mongoose from "mongoose";
import User from "../db/models/User";

const mkUserFieldIsUnique = (field: string) => {

    return async (value: string) => {

        if (field === '_id') {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid value.`);
            }
        }

        if (await User.findOne({
            [field]: value
        })) {
            throw new Error(`"${value}" has already been chosen. Please, try another value`);
        }
    }
}

export default mkUserFieldIsUnique;