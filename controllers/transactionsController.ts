import { Request, Response, NextFunction } from "express";
import { SUCCESSFUL } from "../config/constants";
import BankAccount from "../db/models/BankAccount";
import Transaction from "../db/models/Transaction";

class TransactionsController {

    async registerTransaction(req: Request, res: Response, next: NextFunction) {

        const bankAcc = await BankAccount.findOne({ customerId: req.body.customerId })

        if (bankAcc) {

            const transaction = await Transaction.create({
                bankAccId: bankAcc._id,
                transactionPeerId: req.body.peerId,
                type: req.body.type,
                amount: req.body.amount,
                remarks: req.body?.remarks ?? 'For business',
                successStat: SUCCESSFUL,
                createdAt: req.body.date
            });

            if (transaction) {

                res.status(200).send({
                    ...await transaction.getFields(transaction)
                });

            }

        }

    }

    async getTransaction(req: Request, res: Response, next: NextFunction) {

    }
}

const transactionsController = new TransactionsController();

export default transactionsController;