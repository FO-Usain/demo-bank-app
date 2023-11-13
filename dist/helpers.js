"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.extractAuthToken = void 0;
var jwt = require('jsonwebtoken');
/**
 * extracts the authorization token from the header of the passed request
 * @param req
 * @returns
 */
const extractAuthToken = (req) => {
    var _a, _b, _c;
    let token = ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer')) ? (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization : null;
    if (!token) {
        return null;
    }
    return token.split(' ')[1];
};
exports.extractAuthToken = extractAuthToken;
const decodeJWT = (token) => {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    return payload;
};
exports.decodeJWT = decodeJWT;
