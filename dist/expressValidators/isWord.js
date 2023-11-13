"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isWord = (value) => {
    if (value.split(' ').length > 1) {
        throw new Error('Value must be a single word');
    }
    return true;
};
exports.default = isWord;
