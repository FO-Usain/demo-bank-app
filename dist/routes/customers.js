"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const constants_1 = require("../config/constants");
const customersController_1 = __importDefault(require("../controllers/customersController"));
const transactionPeersController_1 = __importDefault(require("../controllers/transactionPeersController"));
const customerExists_1 = __importDefault(require("../expressValidators/customerExists"));
const customerIdIsValid_1 = __importDefault(require("../expressValidators/customerIdIsValid"));
const isAccNumber_1 = __importDefault(require("../expressValidators/isAccNumber"));
const isPositiveNumber_1 = __importDefault(require("../expressValidators/isPositiveNumber"));
const isWord_1 = __importDefault(require("../expressValidators/isWord"));
const mkMatchesAnOption_1 = __importDefault(require("../expressValidators/mkMatchesAnOption"));
const transactionPeerExists_1 = __importDefault(require("../expressValidators/transactionPeerExists"));
const userFieldIsUnique_1 = __importDefault(require("../expressValidators/userFieldIsUnique"));
const auth_1 = require("../middlewares/auth");
const handleValidationErrs_1 = __importDefault(require("../middlewares/handleValidationErrs"));
var asyncHandle = require('express-async-handler');
const customersRouter = (0, express_1.Router)();
const validateRegEmail = (0, express_validator_1.body)('email').notEmpty().withMessage('This field is required.').bail().isEmail().withMessage('A valid email-address is expected here.').custom(asyncHandle((0, userFieldIsUnique_1.default)('email'))).bail();
const validateRegPassword = (0, express_validator_1.body)('password').notEmpty().withMessage('This field is required.');
const validateRegFirstName = (0, express_validator_1.body)('firstName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegLastName = (0, express_validator_1.body)('lastName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegMiddleName = (0, express_validator_1.body)('middleName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegDateOfBirth = (0, express_validator_1.body)('dateOfBirth').notEmpty().withMessage('This field is required.').bail().isISO8601().toDate().withMessage('A date is expected.').bail();
const validateRegGender = (0, express_validator_1.body)('gender').notEmpty().withMessage('This field is required.').bail().custom((0, mkMatchesAnOption_1.default)(constants_1.GENDERS)).withMessage('Invalid option').bail();
const validateRegAccType = (0, express_validator_1.body)('accType').notEmpty().withMessage('This field is required.').bail().custom((0, mkMatchesAnOption_1.default)(constants_1.ACC_TYPES)).bail();
const validateRegAccNumber = (0, express_validator_1.body)('accNumber').notEmpty().withMessage('This field is required.').custom(isAccNumber_1.default).bail();
const validateMaxMoneyTransferCount = (0, express_validator_1.body)('maxMoneyTransferCount').notEmpty().withMessage('This field is required.').bail().custom(isPositiveNumber_1.default).bail();
const validatePCustomerId = (0, express_validator_1.param)('customerId').custom(asyncHandle((0, customerExists_1.default)('_id'))).bail(); //Validate parameter-customer-ID
const validateQIsBeneficiary = (0, express_validator_1.query)('isBeneficiary').optional({ values: "falsy" }).isBoolean().withMessage('Value must be set to true or false.').bail(); //validate the request's query: isBeneficiary
const validateParamsCustomerId = (0, express_validator_1.param)('customerId').custom(asyncHandle(customerIdIsValid_1.default)).bail();
const validatePeerId = (0, express_validator_1.body)('peerId').notEmpty().withMessage('This field is required.').bail().custom((0, transactionPeerExists_1.default)('_id')).bail();
const validateTransactionVisible = (0, express_validator_1.body)('isVisible').notEmpty().withMessage('This field is required.').bail().isBoolean().withMessage('Value must be set to true or false.').bail();
customersRouter.post('/customer', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), validateRegEmail, validateRegPassword, validateRegFirstName, validateRegLastName, validateRegMiddleName, validateRegDateOfBirth, validateRegGender, validateRegAccType, validateRegAccNumber, validateMaxMoneyTransferCount, handleValidationErrs_1.default, asyncHandle(customersController_1.default.registerCustomer));
customersRouter.get('/customers', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), 
//TODO: add middlewares
asyncHandle(customersController_1.default.getCustomers));
customersRouter.get('/customers/:customerId/transactionpeers', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), validatePCustomerId, validateQIsBeneficiary, handleValidationErrs_1.default, asyncHandle(customersController_1.default.getTransactionPeers));
customersRouter.get('/customers/:customerId/beneficiaries', asyncHandle(auth_1.isAuthenticated), 
//TODO: add middlewares
//validate query('isVisible') if isset
asyncHandle(customersController_1.default.getBeneficiaries));
/**
 *
 */
customersRouter.get('/customers/:customerId/transactions', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)));
customersRouter.post('/customers/:customerId/beneficiary', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), validatePCustomerId, validatePeerId, validateTransactionVisible, handleValidationErrs_1.default, transactionPeersController_1.default.peerToBeneficiary);
customersRouter.post('/customers/:customerId/deactivate', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), 
//TODO: add middlewares
asyncHandle(customersController_1.default.deactivateCustomer));
customersRouter.post('/customers/:customerId/reactivate', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), 
//TODO: add middlewares
asyncHandle(customersController_1.default.reactivateCustomer));
customersRouter.post(`/customers/:customerId/${constants_1.DEBIT}`, asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.CUSTOMER)), validateParamsCustomerId, handleValidationErrs_1.default, asyncHandle(auth_1.authCustomerIsParamCustomer), 
//TODO: add middlewares
asyncHandle(customersController_1.default.registerDebit));
exports.default = customersRouter;
