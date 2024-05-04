import { Response, Request, NextFunction } from "express";
import { HttpException } from "../Types/error";

/*  this error handling middleware will be called first
    when function next(err) is called from controller.
    it prints error stack trace and passes error to the next
    error handling middleware
*/
export const logErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    console.error(err.stack);
    next(err);
}


/*
    this is error middleware that will be called second in
    the case of error being instance of HttpException.
    HttpException extends error with status code and therefore
    can be used as response generator in the case of an error.
    If error is not a instance of HttpException, handler is passing
    error to default error handler with function next(err)
*/
export const httpExceptionHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof HttpException){
        res.status(err.status).send(err.message);
    }else{
        next(err);
    }
}

/*
    this is a default error handler which will be called in by
    all error throws which are not of a HttpException type.
    It responds with status code 500 and gives message Internal server error.
*/
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send("Internal server error");
}


