import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
) => {
  let customError = {
    msg: err.message || 'Something went wrong try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
