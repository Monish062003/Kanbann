import { Request, Response, NextFunction } from 'express';

// This function wraps an async function to handle errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default asyncHandler;
