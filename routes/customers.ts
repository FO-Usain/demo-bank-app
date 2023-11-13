import { Router } from "express";
import { body, param, query } from "express-validator";
import { ACC_TYPES, ADMIN, CUSTOMER, DEBIT, GENDERS } from "../config/constants";
import customersController from "../controllers/customersController";
import transactionPeersController from "../controllers/transactionPeersController";
import mkCustomerExists from "../expressValidators/customerExists";
import customerIdIsValid from "../expressValidators/customerIdIsValid";
import isAccNumber from "../expressValidators/isAccNumber";
import isPositiveNumber from "../expressValidators/isPositiveNumber";
import isWord from "../expressValidators/isWord";
import mkMatchesAnOption from "../expressValidators/mkMatchesAnOption";
import mkTransactionPeerExists from "../expressValidators/transactionPeerExists";
import mkUserFieldIsUnique from "../expressValidators/userFieldIsUnique";
import { authCustomerIsParamCustomer, isAuthenticated, mkPlaysRole } from "../middlewares/auth";
import handleValidationErrs from "../middlewares/handleValidationErrs";

var asyncHandle = require('express-async-handler');

const customersRouter = Router();


const validateRegEmail = body('email').notEmpty().withMessage('This field is required.').bail().isEmail().withMessage('A valid email-address is expected here.').custom(asyncHandle(mkUserFieldIsUnique('email'))).bail();
const validateRegPassword = body('password').notEmpty().withMessage('This field is required.');

const validateRegFirstName = body('firstName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegLastName = body('lastName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegMiddleName = body('middleName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord).bail();
const validateRegDateOfBirth = body('dateOfBirth').notEmpty().withMessage('This field is required.').bail().isISO8601().toDate().withMessage('A date is expected.').bail();
const validateRegGender = body('gender').notEmpty().withMessage('This field is required.').bail().custom(mkMatchesAnOption(GENDERS)).withMessage('Invalid option').bail();

const validateRegAccType = body('accType').notEmpty().withMessage('This field is required.').bail().custom(mkMatchesAnOption(ACC_TYPES)).bail();
const validateRegAccNumber = body('accNumber').notEmpty().withMessage('This field is required.').custom(isAccNumber).bail();
const validateMaxMoneyTransferCount = body('maxMoneyTransferCount').notEmpty().withMessage('This field is required.').bail().custom(isPositiveNumber).bail();

const validatePCustomerId = param('customerId').custom(asyncHandle(mkCustomerExists('_id'))).bail();       //Validate parameter-customer-ID
const validateQIsBeneficiary = query('isBeneficiary').optional({ values: "falsy" }).isBoolean().withMessage('Value must be set to true or false.').bail();      //validate the request's query: isBeneficiary

const validateParamsCustomerId = param('customerId').custom(asyncHandle(customerIdIsValid)).bail();

const validatePeerId = body('peerId').notEmpty().withMessage('This field is required.').bail().custom(mkTransactionPeerExists('_id')).bail();
const validateTransactionVisible = body('isVisible').notEmpty().withMessage('This field is required.').bail().isBoolean().withMessage('Value must be set to true or false.').bail();


customersRouter.post('/customer',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),

    validateRegEmail,
    validateRegPassword,

    validateRegFirstName,
    validateRegLastName,
    validateRegMiddleName,
    validateRegDateOfBirth,
    validateRegGender,

    validateRegAccType,
    validateRegAccNumber,
    validateMaxMoneyTransferCount,

    handleValidationErrs,
    asyncHandle(customersController.registerCustomer)
);

customersRouter.get('/customers',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    //TODO: add middlewares

    asyncHandle(customersController.getCustomers)
);

customersRouter.get('/customers/:customerId/transactionpeers',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    validatePCustomerId,
    validateQIsBeneficiary,
    handleValidationErrs,
    asyncHandle(customersController.getTransactionPeers)
);

customersRouter.get('/customers/:customerId/beneficiaries',
    asyncHandle(isAuthenticated),
    //TODO: add middlewares
    //validate query('isVisible') if isset

    asyncHandle(customersController.getBeneficiaries)
);

/**
 * 
 */
customersRouter.get('/customers/:customerId/transactions',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    //TODO: add controller
);


customersRouter.post('/customers/:customerId/beneficiary',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    validatePCustomerId,
    validatePeerId,
    validateTransactionVisible,
    handleValidationErrs,
    transactionPeersController.peerToBeneficiary
);


customersRouter.post('/customers/:customerId/deactivate',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    //TODO: add middlewares

    asyncHandle(customersController.deactivateCustomer)
);

customersRouter.post('/customers/:customerId/reactivate',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(ADMIN)),
    //TODO: add middlewares

    asyncHandle(customersController.reactivateCustomer)
);

customersRouter.post(`/customers/:customerId/${DEBIT}`,
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    validateParamsCustomerId,
    handleValidationErrs,
    asyncHandle(authCustomerIsParamCustomer),
    //TODO: add middlewares


    asyncHandle(customersController.registerDebit)
);

export default customersRouter;