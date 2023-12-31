"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const constants_1 = require("../config/constants");
const transactionPeersController_1 = __importDefault(require("../controllers/transactionPeersController"));
const customerExists_1 = __importDefault(require("../expressValidators/customerExists"));
const transactionPeerExists_1 = __importDefault(require("../expressValidators/transactionPeerExists"));
const isAccNumber_1 = __importDefault(require("../expressValidators/isAccNumber"));
const isWord_1 = __importDefault(require("../expressValidators/isWord"));
const auth_1 = require("../middlewares/auth");
const handleValidationErrs_1 = __importDefault(require("../middlewares/handleValidationErrs"));
const customersController_1 = __importDefault(require("../controllers/customersController"));
const mkMatchesAnOption_1 = __importDefault(require("../expressValidators/mkMatchesAnOption"));
const bankNames_1 = __importDefault(require("../config/bankNames"));
var asyncHandle = require('express-async-handler');
const transactionPeersRouter = (0, express_1.Router)();
const validateRegFirstName = (0, express_validator_1.body)('firstName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegLastName = (0, express_validator_1.body)('lastName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegMiddleName = (0, express_validator_1.body)('middleName').notEmpty().withMessage('This field is required.').bail().isString().bail().custom(isWord_1.default).bail();
const validateRegBankName = (0, express_validator_1.body)('bankName').notEmpty().withMessage('This field is required.').bail().isString().bail();
const validateRegAccountNumber = (0, express_validator_1.body)('accountNumber').notEmpty().withMessage('This field is required.').bail().custom(isAccNumber_1.default).bail();
const validateQBankName = (0, express_validator_1.query)('bankName').notEmpty().withMessage('This field is required.').custom((0, mkMatchesAnOption_1.default)(bankNames_1.default)).bail();
const validateQAccNumber = (0, express_validator_1.query)('accNumber').notEmpty().withMessage('This field is required.').custom(isAccNumber_1.default).bail();
const validateCustomerId = (0, express_validator_1.body)('customerId').notEmpty().withMessage('This field is required.').bail().custom(asyncHandle((0, customerExists_1.default)('_id'))).bail();
const validateTransactionPeerId = (0, express_validator_1.body)('transactionPeerId').notEmpty().withMessage('This field is required.').bail().custom((0, transactionPeerExists_1.default)('_id')).bail();
const validateIsVisible = (0, express_validator_1.body)('isVisible');
transactionPeersRouter.post('/transaction-peer', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.ADMIN)), validateRegFirstName, validateRegLastName, validateRegMiddleName, validateRegBankName, validateRegAccountNumber, validateCustomerId, handleValidationErrs_1.default, asyncHandle(transactionPeersController_1.default.addTransactionPeer));
transactionPeersRouter.post('/beneficiary', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.CUSTOMER)), validateTransactionPeerId, handleValidationErrs_1.default, asyncHandle(customersController_1.default.addBeneficiary));
transactionPeersRouter.get('/beneficiary', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.CUSTOMER)), validateQBankName, validateQAccNumber, handleValidationErrs_1.default, asyncHandle(customersController_1.default.getBeneficiary));
transactionPeersRouter.get('/beneficiaries', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.CUSTOMER)), asyncHandle(customersController_1.default.getBeneficiaries));
exports.default = transactionPeersRouter;
