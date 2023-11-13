import { Request } from "express";
var jwt = require('jsonwebtoken');

/**
 * extracts the authorization token from the header of the passed request
 * @param req 
 * @returns 
 */
export const extractAuthToken = (req: Request): any => {
    let token = req.headers?.authorization?.startsWith('Bearer') ? req.headers?.authorization : null;


    if (!token) {
        return null;
    }

    return token.split(' ')[1];
}

export const decodeJWT = (token: string) => {
    const payload = jwt.verify(token, process.env.JWT_KEY);

    return payload;
}