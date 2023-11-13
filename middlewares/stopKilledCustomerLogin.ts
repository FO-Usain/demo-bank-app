import { Request, Response, NextFunction } from "express";
import { CUSTOMER, ERR_KILLED } from "../config/constants";
import BankAccount from "../db/models/BankAccount";
import Customer from "../db/models/Customer";
import User from "../db/models/User";

/**
 * Killed Customer is the customer that reach his/her maximum number of transfers
 * @param req 
 * @param res 
 * @param next 
 */
const stopKilledCustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (user && user.role === CUSTOMER) {
        const customer = await Customer.findOne({ userId: user._id });

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
    }

    next();
}

export default stopKilledCustomerLogin;