import { NextFunction, Request, Response } from "express"
import { log } from "../utility/logger.utility"

export const logRequest = async (req: Request, res: Response, next: NextFunction) => {
    log.debug(`::${req.method} ${req.originalUrl} \n
                url parameters : ${JSON.stringify(req.params)}
                query parameters: ${JSON.stringify(req.query)}
                requested from: ${JSON.stringify(req.headers.referer)}
                auth header: ${JSON.stringify(req.headers.authorization)}
                data : ${JSON.stringify(req.body)}
        `);
    next();
}