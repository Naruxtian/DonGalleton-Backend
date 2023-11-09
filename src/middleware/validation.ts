import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ErrorResponse from '../util/errorResponse';

export const validation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new ErrorResponse("Revise su peticion, datos incompatibles", 400)
        )
    } 

    return next();
}