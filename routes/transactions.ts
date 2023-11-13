import { Router } from "express";
import { body } from "express-validator";
import { ADMIN, CUSTOMER, DEBIT, TRANSACTION_TYPES } from "../config/constants";
import customersController from "../controllers/customersController";
import transactionsController from "../controllers/transactionsController";
import mkCustomerExists from "../expressValidators/customerExists";
import isPositiveNumber from "../expressValidators/isPositiveNumber";
import mkMatchesAnOption from "../expressValidators/mkMatchesAnOption";
import mkTransactionPeerExists from "../expressValidators/transactionPeerExists";
import amountIsInLimit from "../middlewares/amountIsInLimit";
import { isAuthenticated, mkPlaysRole, pinIsForAuthenticatedUser } from "../middlewares/auth";
import handleValidationErrs from "../middlewares/handleValidationErrs";
import stopKilledAuthenticatedCustomer from "../middlewares/stopKilledAuthenticatedCustomer";

var asyncHandle = require('express-async-handler');

const transactionsRouter = Router();

const validateCustomerId = body('customerId').notEmpty().withMessage('This field is required.').bail().custom(asyncHandle(mkCustomerExists('_id'))).bail();
const validateType = body('type').notEmpty().withMessage('This field is required.').bail().custom(mkMatchesAnOption(TRANSACTION_TYPES)).bail();
const validateAmount = body('amount').notEmpty().withMessage('This field is required.').bail().custom(isPositiveNumber).bail();
const validateRemarks = body('remarks').optional({ values: 'falsy' }).bail();
const validateDate = body('date').notEmpty().withMessage('This field is required.').bail().isISO8601().toDate().withMessage('A date is expected.').bail();
const validatePeerId = body('peerId').notEmpty().withMessage('This field is required.').bail().custom(asyncHandle(mkTransactionPeerExists('_id')));
const validatePin = body('pin').notEmpty().withMessage('This field is required.').bail();


transactionsRouter.post('/transaction',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    validateCustomerId,
    validateType,
    validateAmount,
    validateRemarks,
    validateDate,
    validatePeerId,
    handleValidationErrs,
    asyncHandle(transactionsController.registerTransaction)
);

transactionsRouter.post('/transfer',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    asyncHandle(stopKilledAuthenticatedCustomer),
    validateCustomerId,
    validateAmount,
    validatePin,
    handleValidationErrs,
    asyncHandle(amountIsInLimit),
    asyncHandle(pinIsForAuthenticatedUser),
    asyncHandle(customersController.mkTransfer)
);

transactionsRouter.get('/transactions',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    asyncHandle(customersController.getTransactions)
);


export default transactionsRouter;