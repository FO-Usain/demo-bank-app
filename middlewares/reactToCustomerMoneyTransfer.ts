import { Request, Response, NextFunction } from "express";
import Customer from "../db/models/Customer";
import { decodeJWT, extractAuthToken } from "../helpers";


const reactToCustomerMoneyTransfer = async (req: Request, res: Response, next: NextFunction) => {
    //pre-condition: User role is Customer
    const authToken = extractAuthToken(req);

    if (authToken) {
        const userId = decodeJWT(authToken).userId;

        const customer = await Customer.findOne({ userId });

        if (customer) {
            // customer.moneyTransferCount = customer.moneyTransferCount as number + 1;

            if (await customer.save()) {
                //everywhere good!
                next();
                return;
            }
        }
    }
}

export default reactToCustomerMoneyTransfer;