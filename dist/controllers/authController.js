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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../db/models/User"));
var jwt = require('jsonwebtoken');
class AuthController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email: req.body.email });
            if (user) {
                const authToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '3d' });
                res.status(200).send(Object.assign(Object.assign({}, user.getFields(user)), { authToken }));
                return;
            }
            next('Something went wrong. Please, try again');
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
const authController = new AuthController();
exports.default = authController;
