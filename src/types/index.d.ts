import { TokenPayload } from '../../middleware/auth';
import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: TokenPayload;
    }
}
