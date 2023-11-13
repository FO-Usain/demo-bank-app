"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleRouterErr = (errMsg, req, res, next) => {
    const status = (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) ? 500 : res.statusCode;
    res.status(status).send({
        err: errMsg
    });
};
exports.default = handleRouterErr;
