import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import IndexRoute from './src/Index'
import errorHandler from './src/middleware/error';

class Server{
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.set('port', 3000);
        this.app.use(cors({ origin: '*' }));
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private routes(): void {
        this.app.use("*/api/", IndexRoute);
        this.app.use(errorHandler)
    }

    public run() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Servidor corriendo en el puerto: ${this.app.get('port')}`);
        });
    }

}

const server = new Server();

server.run();