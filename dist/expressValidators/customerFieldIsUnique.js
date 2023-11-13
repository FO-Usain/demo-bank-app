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
const mongoose_1 = __importDefault(require("mongoose"));
const Customer_1 = __importDefault(require("../db/models/Customer"));
const mkCustomerFieldIsUnique = (field) => {
    return (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (field === '_id') {
            if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid value.`);
            }
        }
        if (yield Customer_1.default.findOne({
            [field]: value
        })) {
            throw new Error(`"${value}" has already been chosen. Please, try another value`);
        }
    });
};
exports.default = mkCustomerFieldIsUnique;
