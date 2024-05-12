/*

    This class is responsible for logging different errors.

*/


export class log {

     public Reset = "\x1b[0m"
     public Bright = "\x1b[1m"
     public Dim = "\x1b[2m"
     public Underscore = "\x1b[4m"
     public Blink = "\x1b[5m"
     public Reverse = "\x1b[7m"
     public Hidden = "\x1b[8m"
     public FgBlack = "\x1b[30m"

     public FgRed = "\x1b[31m"
     public FgGreen = "\x1b[32m"
     public FgYellow = "\x1b[33m"
     public FgBlue = "\x1b[34m"
     public FgMagenta = "\x1b[35m"
     public FgCyan = "\x1b[36m"
     public FgWhite = "\x1b[37m"
     public FgGray = "\x1b[90mpublic#"
     public BgBlack = "\x1b[40m"

     public BgRed = "\x1b[41m"
     public BgGreen = "\x1b[42m"
     public BgYellow = "\x1b[43m"
     public BgBlue = "\x1b[44m"
     public BgMagenta = "\x1b[45m"
     public BgCyan = "\x1b[46m"
     public BgWhite = "\x1b[47m"
     public BgGray = "\x1b[100m"

    public static info(message: string, ...additionalParameters: string[]){

        const logString = additionalParameters.reduce((prev, curr) => {
            return prev + " " + curr;
        }, "--INFO--- " + message)

        console.info("\x1b[33m%s\x1b[0m", logString);
    
    }

    public static error(message: string, ...additionalParameters: string[]){

        const logString = additionalParameters.reduce((prev, curr) => {
            return prev + " " + curr;
        }, "--ERROR-- " + message);

        console.error("\x1b[31m%s\x1b[0m", logString);

    }

    public static success(message: string, ...additionalParameters: string[]){

        const logString = additionalParameters.reduce((prev, curr) => {
            return prev + " " + curr;
        }, "--SUCCESS " + message);

        console.info("\x1b[32m%s\x1b[0m", logString);

    }

    public static debug(message: string, ...additionalParameters: string[]){

        const logString = additionalParameters.reduce((prev, curr) => {
            return prev + " " + curr;
        }, "--DEBUG-- " + message);

        console.info("\x1b[37m%s\x1b[0m", logString);

    }


    public static printHeader(){
        console.log("\x1b[36m%s\x1b[0m", "******************************************");
        console.log("\x1b[36m%s\x1b[0m", "--MSGTYPE            MESSAGE");
        console.log("\x1b[36m%s\x1b[0m", "------------------------------------------");
    }
    


}