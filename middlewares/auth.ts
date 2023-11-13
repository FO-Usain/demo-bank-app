import { Request, Response, NextFunction } from "express";
import Customer from "../db/models/Customer";
import User from "../db/models/User";
import { decodeJWT, extractAuthToken } from "../helpers";

var jwt = require('jsonwebtoken');

export const loginCredentialsCorrect = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.passwordMatches(user, req.body.password)) {
        res.status(400);

        next('Email or password incorrect. Please, try again.');
        return;
    }

    next();
}

export const pinIsForAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = extractAuthToken(req);

    const authData = decodeJWT(authToken);

    const user = await User.findOne({ _id: authData?.userId ?? '' });

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
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    const authToken = extractAuthToken(req);

    if (authToken) {
        const tokenPayload = decodeJWT(authToken);

        if (await User.findOne({ _id: tokenPayload.userId })) {
            next();
            return;
        }
    }

    res.status(401);
    next('Unathorized: Login to continue.');
    return;
}

export const isUnAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    if (extractAuthToken(req)) {

        res.status(401);
        next('Unathorized: Logout to continue.');
        return;
    }

    next();
    return;

}

/**
 * authenticated Customer is param customer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const authCustomerIsParamCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const pCustomerId = req.params?.customerId ?? '';

    const paramCustomer = await Customer.findOne({ _id: pCustomerId });

    if (paramCustomer) {
        const aCustomerId = decodeJWT(extractAuthToken(req));       //Authenticated Customer ID

        const authCustomer = await Customer.findOne({ _id: aCustomerId });      //Authencitcated Customer

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
}

export const mkPlaysRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {     //playsRole
        const authToken = extractAuthToken(req);

        if (authToken) {        //an authorization token is coupled with the passed request
            const decoded = decodeJWT(authToken);

            if (decoded?.userId) {      //the user is authenticated
                const user = await User.findById(decoded.userId);

                if (user?.role === role) {      //the user plays the passed role
                    next();
                    return;
                }
            }
        }

        res.status(401);
        next(`Unauthorized: only ${role}s can perform this action.`);
    }
}