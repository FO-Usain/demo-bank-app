import { Request, Response, NextFunction } from "express";
import TransactionPeer from "../db/models/TransactionPeer";

class TransactionPeersController {

    async addTransactionPeer(req: Request, res: Response, next: NextFunction) {
        const transactionPeer = await TransactionPeer.create(req.body);

        if (transactionPeer) {
            res.status(200).send({
                ...await transactionPeer.getFields(transactionPeer)
            });
        }
    }

    async peerToBeneficiary(req: Request, res: Response, next: NextFunction) {
        const peerId = req.body.peerId;
        const isVisible = req.body.isVisble;

        const beneficiary = await TransactionPeer.findByIdAndUpdate(peerId, { isBeneficiary: true, isVisible });

        if (beneficiary) {
            res.status(200).send({
                ...beneficiary.getFields(beneficiary),
                isBeneficiary: beneficiary.isBeneficiary,
                isVisible: beneficiary.isVisible
            });
            return;
        }
    }

}

const transactionPeersController = new TransactionPeersController();

export default transactionPeersController;