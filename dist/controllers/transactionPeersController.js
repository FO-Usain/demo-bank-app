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
const TransactionPeer_1 = __importDefault(require("../db/models/TransactionPeer"));
class TransactionPeersController {
    addTransactionPeer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionPeer = yield TransactionPeer_1.default.create(req.body);
            if (transactionPeer) {
                res.status(200).send(Object.assign({}, yield transactionPeer.getFields(transactionPeer)));
            }
        });
    }
    peerToBeneficiary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const peerId = req.body.peerId;
            const isVisible = req.body.isVisble;
            const beneficiary = yield TransactionPeer_1.default.findByIdAndUpdate(peerId, { isBeneficiary: true, isVisible });
            if (beneficiary) {
                res.status(200).send(Object.assign(Object.assign({}, beneficiary.getFields(beneficiary)), { isBeneficiary: beneficiary.isBeneficiary, isVisible: beneficiary.isVisible }));
                return;
            }
        });
    }
}
const transactionPeersController = new TransactionPeersController();
exports.default = transactionPeersController;
