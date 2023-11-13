import { Request, Response, NextFunction } from "express";
import User from "../db/models/User";

var jwt = require('jsonwebtoken');

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        const user = await User.findOne({email: req.body.email});

        if (user) {
            const authToken = jwt.sign({userId: user._id}, process.env.JWT_KEY, {expiresIn: '3d'});

            res.status(200).send({
                ...user.getFields(user),
                authToken
            });
            return;
        }

        next('Something went wrong. Please, try again');
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        
    }
}

const authController = new AuthController();

export default authController;