import { Request, Response, NextFunction } from "express";
import { CUSTOMER, DEBIT, SUCCESSFUL } from "../config/constants";
import BankAccount from "../db/models/BankAccount";
import Customer from "../db/models/Customer";
import Transaction, { ITransactionFields } from "../db/models/Transaction";
import TransactionPeer from "../db/models/TransactionPeer";
import User from "../db/models/User";
import { decodeJWT, extractAuthToken } from "../helpers";

class CustomersController {

    async registerCustomer(req: Request, res: Response, next: NextFunction) {

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            role: CUSTOMER,
        });

        if (user) {     //customer has been registerred as a User of the system

            const customer = await Customer.create({
                userId: user._id,

                firstName: req.body.firstName,
                lastName: req.body.lastName,
                middleName: req.body.middleName,

                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
            });

            if (customer) {

                const bankAccount = await BankAccount.create({
                    customerId: customer._id,
                    accType: req.body.accType,
                    accNumber: req.body.accNumber,
                    maxMoneyTransferCount: req.body.maxMoneyTransferCount,
                    moneyTransferCount: 0
                });

                if (bankAccount) {

                    res.status(200).send({
                        customer: {
                            ...await customer.getFields(customer),
                            bankAcc: {
                                ...await bankAccount.getFields(bankAccount)
                            }
                        }
                    });
                    return;

                }

                await customer.deleteOne();
            }

            await user.deleteOne();

        }

    }

    async registerDebit(req: Request, res: Response, next: NextFunction) {

    }

    /**
     * in the response, sends the details of the currently logged in customer
     * @param req 
     * @param res 
     * @param next 
     */
    async getLoggedInCustomer(req: Request, res: Response, next: NextFunction) {

        const authToken = extractAuthToken(req);

        const authData = decodeJWT(authToken);

        const customer = await Customer.findOne({ userId: authData?.userId });

        if (customer) {
            res.status(200).send({
                ...await customer.getFields(customer)
            });
            return;
        }

    }

    /**
     * in the response, sends the details of all the customers registerred in the system
     * @param req 
     * @param res 
     * @param next 
     */
    async getCustomers(req: Request, res: Response, next: NextFunction) {

    }

    /**
     * gets all the transaction-peers of a particular customer and sends them in the response
     * In the query of the request, if isBeneficiary is false, only the transaction-peers yet to be beneficiaries are gotten
     * @param req 
     * @param res 
     * @param next 
     */
    async getTransactionPeers(req: Request, res: Response, next: NextFunction) {
        const customerId = req.params.customerId;

        const query = TransactionPeer.find({ customerId });

        if (typeof req.query.isBeneficiary !== undefined) {

            const isBeneficiary = req.query.isBeneficiary;

            if (isBeneficiary === 'true') {

                query.where('isBeneficiary').equals(true);
            } else {

                query.where('isBeneficiary').equals(false);
            }

        }

        const transactionPeers = await query.exec();

        if (transactionPeers) {
            res.status(200).send({
                customerId,
                transactionPeers: [
                    ...transactionPeers
                ]
            });
        }

    }

    async addBeneficiary(req: Request, res: Response, next: NextFunction) {

    }

    async getBeneficiary(req: Request, res: Response, next: NextFunction) {

        const authToken = extractAuthToken(req);

        const authData = decodeJWT(authToken);

        const customer = await Customer.findOne({ userId: authData?.userId ?? '' });

        if (customer) {

            const bankName = req.query?.bankName ?? '';
            const accNumber = req.query?.accNumber ?? '';

            const beneficiary = await TransactionPeer.findOne({
                customerId: customer._id,
                isBeneficiary: true,
                bankName,
                accountNumber: accNumber
            });

            if (beneficiary) {
                res.status(200).send({
                    ...await beneficiary.getFields(beneficiary)
                });
                return;
            } else {
                res.status(400);
                next('The intended beneficiary cannot be trusted. Try another beneficiary.');
            }

        }
    }

    /**
     * gets all the beneficiaries of a particular customer and sends them in the response.
     * In the query of the request, if isVisible is true, only the visible beneficiaries are gotten
     * @param req 
     * @param res 
     * @param next 
     */
    async getBeneficiaries(req: Request, res: Response, next: NextFunction) {

        const authToken = extractAuthToken(req);

        const authData = decodeJWT(authToken);

        if (authData?.userId) {
            const customer = await Customer.findOne({ userId: authData.userId });

            if (customer) {

                const beneficiaries = await TransactionPeer.find({
                    customerId: customer._id,
                    isBeneficiary: true,
                    isVisible: true
                });

                if (beneficiaries) {

                    let apparent = [];
                    let itr = 0;
                    for (const beneficiary of beneficiaries) {
                        apparent[itr++] = beneficiary.getFields(beneficiary);
                    }

                    res.status(200).send({
                        beneficiaries: [...apparent]
                    });

                    return;
                }


            }
        }

        next('Something went wrong. Please, try again in a few seconds.!');

    }

    /**
     * gets all transactions a particular customer is involved in
     * @param req 
     * @param res 
     * @param next 
     */
    async getTransactions(req: Request, res: Response, next: NextFunction) {

        const authToken = extractAuthToken(req);

        const authData = decodeJWT(authToken);

        if (authData) {
            const customer = await Customer.findOne({ userId: authData.userId });

            if (customer) {
                const bankAcc = await BankAccount.findOne({ customerId: customer._id });

                if (bankAcc) {

                    const transactions = await Transaction.find({ bankAccId: bankAcc._id }).sort({ createdAt: -1 });

                    if (transactions) {
                        let apparent: ITransactionFields[] = [];
                        let itr = 0;

                        for (const transaction of transactions) {
                            apparent[itr++] = await transaction.getFields(transaction);
                        }

                        res.status(200).send({
                            transactions: [
                                ...apparent
                            ]
                        });
                        return;
                    }

                }
            }
        }

        next('Something went wrong');

    }

    async mkTransfer(req: Request, res: Response, next: NextFunction) {

        const customer = await Customer.findOne({ _id: req.body.customerId });

        if (customer) {
            const bankAcc = await BankAccount.findOne({ customerId: customer._id });

            if (bankAcc) {

                const transaction = await Transaction.create({
                    bankAccId: bankAcc._id,
                    transactionPeerId: req.body.peerId,
                    amount: Number(req.body.amount),
                    type: DEBIT,
                    createdAt: new Date(),
                    successStat: SUCCESSFUL,
                    remarks: req.body.remarks === '' ? `A Transaction made on ${(new Date()).toDateString()}.` : req.body.remarks
                });

                if (transaction) {
                    bankAcc.moneyTransferCount = Number(bankAcc.moneyTransferCount) + 1;

                    if (await bankAcc.save()) {
                        setTimeout(async () => {
                            res.status(200).send({
                                ...await transaction.getFields(transaction)
                            });
                        }, 5 * 1000);
                        return;
                    }
                }
            }
        }

        next('Something went wrong. Please, try again.');

    }

    async deactivateCustomer(req: Request, res: Response, next: NextFunction) {

    }

    async reactivateCustomer(req: Request, res: Response, next: NextFunction) {

    }

}

const customersController = new CustomersController();

export default customersController;