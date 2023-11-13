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
exports.mkPlaysRole = exports.authCustomerIsParamCustomer = exports.isUnAuthenticated = exports.isAuthenticated = exports.pinIsForAuthenticatedUser = exports.loginCredentialsCorrect = void 0;
const Customer_1 = __importDefault(require("../db/models/Customer"));
const User_1 = __importDefault(require("../db/models/User"));
const helpers_1 = require("../helpers");
var jwt = require('jsonwebtoken');
const loginCredentialsCorrect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user || !user.passwordMatches(user, req.body.password)) {
        res.status(400);
        next('Email or password incorrect. Please, try again.');
        return;
    }
    next();
});
exports.loginCredentialsCorrect = loginCredentialsCorrect;
const pinIsForAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authToken = (0, helpers_1.extractAuthToken)(req);
    const authData = (0, helpers_1.decodeJWT)(authToken);
    const user = yield User_1.default.findOne({ _id: (_a = authData === null || authData === void 0 ? void 0 : authData.userId) !== null && _a !== void 0 ? _a : '' });
    if (!user || !user.passwordMatches(user, req.body.pin)) {
        res.status(400).send({
            errors: [
                {
                    location: 'body',
                    msg: 'Incorrect.',
                    path: 'pin',
                    type: 'field',
                    value: '',
                }
            ]
        });
        return;
    }
    next();
});
exports.pinIsForAuthenticatedUser = pinIsForAuthenticatedUser;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (0, helpers_1.extractAuthToken)(req);
    if (authToken) {
        const tokenPayload = (0, helpers_1.decodeJWT)(authToken);
        if (yield User_1.default.findOne({ _id: tokenPayload.userId })) {
            next();
            return;
        }
    }
    res.status(401);
    next('Unathorized: Login to continue.');
    return;
});
exports.isAuthenticated = isAuthenticated;
const isUnAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, helpers_1.extractAuthToken)(req)) {
        res.status(401);
        next('Unathorized: Logout to continue.');
        return;
    }
    next();
    return;
});
exports.isUnAuthenticated = isUnAuthenticated;
/**
 * authenticated Customer is param customer
 * @param req
 * @param res
 * @param next
 * @returns
 */
const authCustomerIsParamCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const pCustomerId = (_c = (_b = req.params) === null || _b === void 0 ? void 0 : _b.customerId) !== null && _c !== void 0 ? _c : '';
    const paramCustomer = yield Customer_1.default.findOne({ _id: pCustomerId });
    if (paramCustomer) {
        const aCustomerId = (0, helpers_1.decodeJWT)((0, helpers_1.extractAuthToken)(req)); //Authenticated Customer ID
        const authCustomer = yield Customer_1.default.findOne({ _id: aCustomerId }); //Authencitcated Customer
        if (authCustomer) {
            if (aCustomerId === pCustomerId) {
                //everywhere good
                next();
                return;
            }
            res.status(400).send({
                errors: [
                    {
                        location: 'params',
                        msg: 'Customer-ID in request must match ID of authenticated Customer.',
                        path: 'customerId',
                        type: 'field',
                        value: '',
                    }
                ]
            });
            return;
        }
        res.status(401);
        next('Unathorized: invalid authorization token.');
    }
    res.status(400);
    next('invalid customer-ID');
});
exports.authCustomerIsParamCustomer = authCustomerIsParamCustomer;
const mkPlaysRole = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authToken = (0, helpers_1.extractAuthToken)(req);
        if (authToken) { //an authorization token is coupled with the passed request
            const decoded = (0, helpers_1.decodeJWT)(authToken);
            if (decoded === null || decoded === void 0 ? void 0 : decoded.userId) { //the user is authenticated
                const user = yield User_1.default.findById(decoded.userId);
                if ((user === null || user === void 0 ? void 0 : user.role) === role) { //the user plays the passed role
                    next();
                    return;
                }
            }
        }
        res.status(401);
        next(`Unauthorized: only ${role}s can perform this action.`);
    });
};
exports.mkPlaysRole = mkPlaysRole;
