import { Request, Response, NextFunction } from "express";

const handleRouterErr = (errMsg: string, req: Request, res: Response, next: NextFunction) => {
    const status = (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) ? 500 : res.statusCode;

    res.status(status).send({
        err: errMsg
    });
}

export default handleRouterErr;