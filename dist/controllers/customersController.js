"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const BankAccount_1 = __importDefault(require("../db/models/BankAccount"));
const Customer_1 = __importDefault(require("../db/models/Customer"));
const Transaction_1 = __importDefault(require("../db/models/Transaction"));
const TransactionPeer_1 = __importDefault(require("../db/models/TransactionPeer"));
const User_1 = __importDefault(require("../db/models/User"));
const helpers_1 = require("../helpers");
class CustomersController {
    registerCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.create({
                email: req.body.email,
                password: req.body.password,
                role: constants_1.CUSTOMER,
            });
            if (user) { //customer has been registerred as a User of the system
                const customer = yield Customer_1.default.create({
                    userId: user._id,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    middleName: req.body.middleName,
                    dateOfBirth: req.body.dateOfBirth,
                    gender: req.body.gender,
                });
                if (customer) {
                    const bankAccount = yield BankAccount_1.default.create({
                        customerId: customer._id,
                        accType: req.body.accType,
                        accNumber: req.body.accNumber,
                        maxMoneyTransferCount: req.body.maxMoneyTransferCount,
                        moneyTransferCount: 0
                    });
                    if (bankAccount) {
                        res.status(200).send({
                            customer: Object.assign(Object.assign({}, yield customer.getFields(customer)), { bankAcc: Object.assign({}, yield bankAccount.getFields(bankAccount)) })
                        });
                        return;
                    }
                    yield customer.deleteOne();
                }
                yield user.deleteOne();
            }
        });
    }
    registerDebit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * in the response, sends the details of the currently logged in customer
     * @param req
     * @param res
     * @param next
     */
    getLoggedInCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = (0, helpers_1.extractAuthToken)(req);
            const authData = (0, helpers_1.decodeJWT)(authToken);
            const customer = yield Customer_1.default.findOne({ userId: authData === null || authData === void 0 ? void 0 : authData.userId });
            if (customer) {
                res.status(200).send(Object.assign({}, yield customer.getFields(customer)));
                return;
            }
        });
    }
    /**
     * in the response, sends the details of all the customers registerred in the system
     * @param req
     * @param res
     * @param next
     */
    getCustomers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * gets all the transaction-peers of a particular customer and sends them in the response
     * In the query of the request, if isBeneficiary is false, only the transaction-peers yet to be beneficiaries are gotten
     * @param req
     * @param res
     * @param next
     */
    getTransactionPeers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = req.params.customerId;
            const query = TransactionPeer_1.default.find({ customerId });
            if (typeof req.query.isBeneficiary !== undefined) {
                const isBeneficiary = req.query.isBeneficiary;
                if (isBeneficiary === 'true') {
                    query.where('isBeneficiary').equals(true);
                }
                else {
                    query.where('isBeneficiary').equals(false);
                }
            }
            const transactionPeers = yield query.exec();
            if (transactionPeers) {
                res.status(200).send({
                    customerId,
                    transactionPeers: [
                        ...transactionPeers
                    ]
                });
            }
        });
    }
    addBeneficiary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getBeneficiary(req, res, next) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = (0, helpers_1.extractAuthToken)(req);
            const authData = (0, helpers_1.decodeJWT)(authToken);
            const customer = yield Customer_1.default.findOne({ userId: (_a = authData === null || authData === void 0 ? void 0 : authData.userId) !== null && _a !== void 0 ? _a : '' });
            if (customer) {
                const bankName = (_c = (_b = req.query) === null || _b === void 0 ? void 0 : _b.bankName) !== null && _c !== void 0 ? _c : '';
                const accNumber = (_e = (_d = req.query) === null || _d === void 0 ? void 0 : _d.accNumber) !== null && _e !== void 0 ? _e : '';
                const beneficiary = yield TransactionPeer_1.default.findOne({
                    customerId: customer._id,
                    isBeneficiary: true,
                    bankName,
                    accountNumber: accNumber
                });
                if (beneficiary) {
                    res.status(200).send(Object.assign({}, yield beneficiary.getFields(beneficiary)));
                    return;
                }
                else {
                    res.status(400);
                    next('The intended beneficiary cannot be trusted. Try another beneficiary.');
                }
            }
        });
    }
    /**
     * gets all the beneficiaries of a particular customer and sends them in the response.
     * In the query of the request, if isVisible is true, only the visible beneficiaries are gotten
     * @param req
     * @param res
     * @param next
     */
    getBeneficiaries(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = (0, helpers_1.extractAuthToken)(req);
            const authData = (0, helpers_1.decodeJWT)(authToken);
            if (authData === null || authData === void 0 ? void 0 : authData.userId) {
                const customer = yield Customer_1.default.findOne({ userId: authData.userId });
                if (customer) {
                    const beneficiaries = yield TransactionPeer_1.default.find({
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
        });
    }
    /**
     * gets all transactions a particular customer is involved in
     * @param req
     * @param res
     * @param next
     */
    getTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = (0, helpers_1.extractAuthToken)(req);
            const authData = (0, helpers_1.decodeJWT)(authToken);
            if (authData) {
                const customer = yield Customer_1.default.findOne({ userId: authData.userId });
                if (customer) {
                    const bankAcc = yield BankAccount_1.default.findOne({ customerId: customer._id });
                    if (bankAcc) {
                        const transactions = yield Transaction_1.default.find({ bankAccId: bankAcc._id }).sort({ createdAt: -1 });
                        if (transactions) {
                            let apparent = [];
                            let itr = 0;
                            for (const transaction of transactions) {
                                apparent[itr++] = yield transaction.getFields(transaction);
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
        });
    }
    mkTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.default.findOne({ _id: req.body.customerId });
            if (customer) {
                const bankAcc = yield BankAccount_1.default.findOne({ customerId: customer._id });
                if (bankAcc) {
                    const transaction = yield Transaction_1.default.create({
                        bankAccId: bankAcc._id,
                        transactionPeerId: req.body.peerId,
                        amount: Number(req.body.amount),
                        type: constants_1.DEBIT,
                        createdAt: new Date(),
                        successStat: constants_1.SUCCESSFUL,
                        remarks: req.body.remarks === '' ? `A Transaction made on ${(new Date()).toDateString()}.` : req.body.remarks
                    });
                    if (transaction) {
                        bankAcc.moneyTransferCount = Number(bankAcc.moneyTransferCount) + 1;
                        if (yield bankAcc.save()) {
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                res.status(200).send(Object.assign({}, yield transaction.getFields(transaction)));
                            }), 5 * 1000);
                            return;
                        }
                    }
                }
            }
            next('Something went wrong. Please, try again.');
        });
    }
    deactivateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    reactivateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
const customersController = new CustomersController();
exports.default = customersController;
