import { Router } from "express";
import { body, query } from "express-validator";
import { ADMIN, CUSTOMER } from "../config/constants";
import transactionPeersController from "../controllers/transactionPeersController";
import mkCustomerExists from "../expressValidators/customerExists";
import mkTransactionPeerExists from '../expressValidators/transactionPeerExists';
import isAccNumber from "../expressValidators/isAccNumber";
import isWord from "../expressValidators/isWord";
import { isAuthenticated, mkPlaysRole } from "../middlewares/auth";
import handleValidationErrs from "../middlewares/handleValidationErrs";
import customersController from "../controllers/customersController";
import mkMatchesAnOption from "../expressValidators/mkMatchesAnOption";
import BANK_NAMES from "../config/bankNames";

var asyncHandle = require('express-async-handler');

const transactionPeersRouter = Router();

const validateRegFirstName = body('firstName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegLastName = body('lastName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegMiddleName = body('middleName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegBankName = body('bankName').notEmpty().withMessage('This field is required.').bail().isString().bail();
const validateRegAccountNumber = body('accountNumber').notEmpty().withMessage('This field is required.').bail().custom(isAccNumber).bail();

const validateQBankName = query('bankName').notEmpty().withMessage('This field is required.').custom(mkMatchesAnOption(BANK_NAMES)).bail();
const validateQAccNumber = query('accNumber').notEmpty().withMessage('This field is required.').custom(isAccNumber).bail();

const validateCustomerId = body('customerId').notEmpty().withMessage('This field is required.').bail().custom(asyncHandle(mkCustomerExists('_id'))).bail();
const validateTransactionPeerId = body('transactionPeerId').notEmpty().withMessage('This field is required.').bail().custom(mkTransactionPeerExists('_id')).bail();
const validateIsVisible = body('isVisible');

transactionPeersRouter.post('/transaction-peer',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    validateRegFirstName,
    validateRegLastName,
    validateRegMiddleName,
    validateRegBankName,
    validateRegAccountNumber,
    validateCustomerId,
    handleValidationErrs,
    asyncHandle(transactionPeersController.addTransactionPeer)
);

transactionPeersRouter.post('/beneficiary',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    validateTransactionPeerId,
    handleValidationErrs,
    asyncHandle(customersController.addBeneficiary)
);

transactionPeersRouter.get('/beneficiary',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    validateQBankName,
    validateQAccNumber,
    handleValidationErrs,
    asyncHandle(customersController.getBeneficiary)
);


transactionPeersRouter.get('/beneficiaries',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    asyncHandle(customersController.getBeneficiaries)
);

export default transactionPeersRouter;