import "reflect-metadata";
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import "@shared/container";
import { AppError } from "@shared/errors/AppError";
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from "@shared/infra/typeorm";

import swaggerFile from '../../../swagger.json';
import { router } from '@shared/infra/http/routes';

createConnection();
const app = express();

//app.use(rateLimiter);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    });
});

export { app };
