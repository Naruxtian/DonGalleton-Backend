import { Response } from 'express';

export default class ResponseHttp {

    public response:  Response;

    constructor(
        response: Response
    ) {
        this.response = response;
    }

    public send<T = any>(
        message: string, 
        data: T,
        success: boolean,
        code: number,
        cookie?: { key?: string, value: T }
    ) : void {
        if ( cookie?.key ) {
            this.response
                .status(code)
                .cookie(cookie.key, cookie.value)
                .json({
                    message,
                    code: code || 500, 
                    success,
                    data: {
                        ...data
                    }
                })
        } else {
            this.response
                .status(code || 500)
                .json({
                    message,
                    code: code || 500, 
                    success,
                    data: {
                        ...data
                    }
                })
        }
    }
}