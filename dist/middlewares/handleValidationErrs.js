"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const handleValidationErrs = (req, response, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        response.status(400).send(errors);
        return;
    }
    next();
};
exports.default = handleValidationErrs;
