import { Request, Response, NextFunction } from "express";
import { ERR_KILLED } from "../config/constants";
import BankAccount from "../db/models/BankAccount";
import Customer from "../db/models/Customer";
import { extractAuthToken } from "../helpers";
import { decodeJWT } from "../helpers";

/**
 * 
 */
const stopKilledAuthenticatedCustomer = async (req: Request, res: Response, next: NextFunction) => {

    const authToken = extractAuthToken(req);
    const authData = decodeJWT(authToken);

    const customer = await Customer.findOne({ userId: authData?.userId ?? '' });

    if (customer) {
        const bankAcc = await BankAccount.findOne({ customerId: customer._id });

        if (bankAcc && (Number(bankAcc.moneyTransferCount) >= Number(bankAcc.maxMoneyTransferCount))) {
            res.status(400).send({
                err: 'Your account has been temporarily frozen, due to some recent unusual activities. Visit our closest branch to get this resolved.',
                errCode: ERR_KILLED
            });
            return;
        }
    }

    next();
}


export default stopKilledAuthenticatedCustomer;