"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERR_KILLED = exports.PENDING = exports.UNSUCCESSFUL = exports.SUCCESSFUL = exports.TRANSACTION_TYPES = exports.DEBIT = exports.CREDIT = exports.ACC_TYPES = exports.CURRENT = exports.SAVINGS = exports.GENDERS = exports.FEMALE = exports.MALE = exports.ROLES = exports.CUSTOMER = exports.ADMIN = void 0;
//roles
exports.ADMIN = 'admin';
exports.CUSTOMER = 'customer';
exports.ROLES = [exports.ADMIN, exports.CUSTOMER];
//genders
exports.MALE = 'male';
exports.FEMALE = 'female';
exports.GENDERS = [exports.MALE, exports.FEMALE];
//Account-types
exports.SAVINGS = 'saving';
exports.CURRENT = 'current';
exports.ACC_TYPES = [exports.SAVINGS, exports.CURRENT];
//Transaction-types
exports.CREDIT = 'credit';
exports.DEBIT = 'debit';
exports.TRANSACTION_TYPES = [exports.CREDIT, exports.DEBIT];
//success statuses
exports.SUCCESSFUL = 'successful';
exports.UNSUCCESSFUL = 'unsuccessful';
exports.PENDING = 'pending';
//error-codes
exports.ERR_KILLED = 'killed customer';
