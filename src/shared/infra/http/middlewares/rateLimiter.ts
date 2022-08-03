import { Response, Request, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

import { AppError } from '@shared/errors/AppError';

const redisClient = createClient();

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 5,
    duration: 5,
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await limiter.consume(request.ip);

        return next();
    } catch (err) {
        throw new AppError("Too many requests", 429);
    }
}