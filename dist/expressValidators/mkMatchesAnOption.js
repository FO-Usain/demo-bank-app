"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkMatchesAnOption = (options) => {
    return (value) => {
        for (const option of options) {
            if (value === option) {
                return true;
            }
        }
        throw new Error(`'${value}' is an invalid option`);
    };
};
exports.default = mkMatchesAnOption;
