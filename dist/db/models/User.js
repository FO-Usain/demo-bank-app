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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var bcrypt = require('bcryptjs');
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSaltSync(10);
        this.password = yield bcrypt.hashSync(this.password, salt);
        next();
    });
});
UserSchema.methods.passwordMatches = (doc, testPassword) => {
    return bcrypt.compareSync(testPassword, doc.password);
};
UserSchema.methods.getFields = (doc) => {
    return {
        id: doc._id,
        email: doc.email,
        role: doc.role,
    };
};
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
