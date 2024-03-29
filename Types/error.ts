
/*
    Class that extends error and is responsible for
    storing status code and error message
    It can be thrown like normal Error from any
    part of route handling.
    Throwing this error from controller or any child function
    will pass this error to error handling middleware
    which will respond with the given status code and message.
*/
export class HttpException extends Error {

    public status: number
    public message: string

    constructor(status: number, message: string){
        super(message);
        this.status = status;
        this.message = message;
    }

}