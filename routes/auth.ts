import { Router } from "express";
import { body } from "express-validator";
import { CUSTOMER } from "../config/constants";
import authController from "../controllers/authController";
import customersController from "../controllers/customersController";
import { isAuthenticated, isUnAuthenticated, loginCredentialsCorrect, mkPlaysRole } from "../middlewares/auth";
import handleValidationErrs from "../middlewares/handleValidationErrs";
import stopKilledCustomerLogin from "../middlewares/stopKilledCustomerLogin";

var asyncHandle = require('express-async-handler');

const authRouter = Router();

const validateLoginEmail = body('email').notEmpty().withMessage('This field is required.').bail().isEmail().withMessage('The email linked to your account goes here.').bail();
const validateLoginPassowrd = body('password').notEmpty().withMessage('This field is required.').bail();

authRouter.post('/login',
    asyncHandle(isUnAuthenticated),
    validateLoginEmail,
    validateLoginPassowrd,
    handleValidationErrs,
    asyncHandle(loginCredentialsCorrect),
    asyncHandle(stopKilledCustomerLogin),
    asyncHandle(authController.login)
);

//get authenticated customer
authRouter.get('/auth/customer',
    asyncHandle(isAuthenticated),
    asyncHandle(mkPlaysRole(CUSTOMER)),
    asyncHandle(customersController.getLoggedInCustomer)
);

authRouter.post('/logout',
    asyncHandle(isAuthenticated),
    asyncHandle(authController.logout)
);

export default authRouter;