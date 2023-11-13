import mongoose from "mongoose";
import TransactionPeer from "../db/models/TransactionPeer";

const mkTransactionPeerExists = (field: string) => {

    return async (value: string) => {

        if (field === '_id') {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid value.`);
            }
        }

        if (await TransactionPeer.findOne({
            [field]: value
        })) {
            return true;
        }

        throw new Error('Invalid value.');
    }
}

export default mkTransactionPeerExists;