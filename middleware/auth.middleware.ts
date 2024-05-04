import {Request, Response, NextFunction} from "express";
import {HttpException} from "../Types/error";
import jsonwebtoken, { JsonWebTokenError, JwtPayload, TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { parseCookie } from "../utility/cookies.utility";

type customJwtPayload = {
     id: string
}

type TokenCookie = {
     token: string
}


/*
     This is a middleware function that handles authentication of all requests
     that choose to implement it. It needs to be present on all routes that should
     be protected.

     USAGE -----
     router.get("/path", [authenticate], controller)
     
     It works by checking for cookie header on request object and verifies
     jwt token by decrypting it with secret key found in .env file

     It will be further developed by using short-expiring tokens that will
     require another authentication by discord oauth server if they are
     expired.

     Furthermore it links user id to request object which can be used by
     any controller that is consuming this middleware. It can be used by
     calling req.userId. This funcionality will ensure easy data querying for
     relevant and authenticated user.
     
*/

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

     try{
          if(process.env.JWT_SECRET){


               const cookiesString = req.headers.cookie;

               if(!cookiesString){
                    throw new HttpException(401, "Cookie is not present");
               }

               const cookieObj = await parseCookie(cookiesString) as TokenCookie;

               
                    
               jsonwebtoken.verify(cookieObj.token, process.env.JWT_SECRET,  (err, decoded) => {
                    
                    if(err){
                         
                         if(err instanceof TokenExpiredError){
                              res.status(401).send("Cookie not good anymore");
                         } else{
                              res.clearCookie("token");
                              res.status(401).send("Unauthorized");
                         }

                    }

                    if(typeof decoded !== "string" && decoded){
                         req.userID = decoded.id;
                    } else {
                         throw new HttpException(500, "Jwt payload missing or not valid");
                    }


                    next();
               });

               


          } else{
               throw new HttpException(500, "Env file isn't set up properly");
          }
          

     } catch(error){
          next(error);
     }

}