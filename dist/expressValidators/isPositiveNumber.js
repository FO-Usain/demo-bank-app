"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPositiveNumber = (value) => {
    if (parseInt(value) > 0) {
        return true;
    }
    throw new Error('A positive number is expected.');
};
exports.default = isPositiveNumber;
