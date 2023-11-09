import { Request, Response } from 'express';
import { NextFunction } from "express-serve-static-core";
import ResponseHttp from "../util/response";
import ErrorResponse from "../util/errorResponse";

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {

    const response = new ResponseHttp(res);
    response.send(err.message || "Bad Request", {}, false, err.code || 500)

}

export default errorHandler;
