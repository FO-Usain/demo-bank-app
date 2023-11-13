import { Request, Response, NextFunction } from "express";
import BankAccount from "../db/models/BankAccount";
import Customer from "../db/models/Customer";
import { decodeJWT, extractAuthToken } from "../helpers";


const amountIsInLimit = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = extractAuthToken(req);

    const authData = decodeJWT(authToken);

    const customer = await Customer.findOne({ userId: authData?.userId ?? '' });

    if (customer) {
        const account = await BankAccount.findOne({ customerId: customer._id });

        if (!account || Number(account.accBalance) < Number(req.body.amount)) {
            res.status(400).send({
                errors: [
                    {
                        location: 'body',
                        msg: 'This field must not be lesser than your balance.',
                        path: 'amount',
                        type: 'field',
                        value: '',
                    }
                ]
            });
            return;
        }

        next();
        return;
    }

    next('Something went wrong. Try again');
}

export default amountIsInLimit;