import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const handleValidationErrs = (req: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        response.status(400).send(errors)
        return;
    }

    next();
};

export default handleValidationErrs;