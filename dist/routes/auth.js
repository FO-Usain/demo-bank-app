"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const constants_1 = require("../config/constants");
const authController_1 = __importDefault(require("../controllers/authController"));
const customersController_1 = __importDefault(require("../controllers/customersController"));
const auth_1 = require("../middlewares/auth");
const handleValidationErrs_1 = __importDefault(require("../middlewares/handleValidationErrs"));
const stopKilledCustomerLogin_1 = __importDefault(require("../middlewares/stopKilledCustomerLogin"));
var asyncHandle = require('express-async-handler');
const authRouter = (0, express_1.Router)();
const validateLoginEmail = (0, express_validator_1.body)('email').notEmpty().withMessage('This field is required.').bail().isEmail().withMessage('The email linked to your account goes here.').bail();
const validateLoginPassowrd = (0, express_validator_1.body)('password').notEmpty().withMessage('This field is required.').bail();
authRouter.post('/login', asyncHandle(auth_1.isUnAuthenticated), validateLoginEmail, validateLoginPassowrd, handleValidationErrs_1.default, asyncHandle(auth_1.loginCredentialsCorrect), asyncHandle(stopKilledCustomerLogin_1.default), asyncHandle(authController_1.default.login));
//get authenticated customer
authRouter.get('/auth/customer', asyncHandle(auth_1.isAuthenticated), asyncHandle((0, auth_1.mkPlaysRole)(constants_1.CUSTOMER)), asyncHandle(customersController_1.default.getLoggedInCustomer));
authRouter.post('/logout', asyncHandle(auth_1.isAuthenticated), asyncHandle(authController_1.default.logout));
exports.default = authRouter;
