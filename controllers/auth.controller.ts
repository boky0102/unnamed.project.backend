import { NextFunction, Request, Response } from "express";
import {getDataFromDiscord} from "../services/auth.services";
import {checkIfUserExistsByDiscordId, registerUser} from "../services/user.service";
import jsonwebtoken from "jsonwebtoken";
import {HttpException} from "../Types/error";
require('dotenv').config();


/*
    Request is made to this controller by discords oauth redirect.
    Discord makes request on this route that looks like
    http:localhost:3000/auth?code=sdsad9f0dsfg90


    This controller is responsible for extracting that
    code from link and calling auth service which will
    get user authentication and other relevant data from discord.
    .
 */

export const authController = async (req: Request, res: Response, next: NextFunction) => {
    try{

        if(process.env.JWT_SECRET === undefined || process.env.FRONTEND_URL === undefined){
            throw new HttpException(500, "Please make sure that your .env files are filled with proper values")
        }

        // extracting data from link
        const code = req.query.code as string;

        const userData = await getDataFromDiscord(code);

        const userId = await checkIfUserExistsByDiscordId(userData.id);

        if(userId){

            const jwt = jsonwebtoken.sign(
                {
                    id: userId
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: 648000
                }
            );

            res.cookie(
                "token",
                jwt,
                {
                    httpOnly: true,
                    secure: false,
                }
            )

            res.redirect(process.env.FRONTEND_URL);


        } else {

            const startTime = new Date().getTime()

            const userId = await registerUser(userData);

            const jwt = jsonwebtoken.sign(
                {
                    id: userId
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: 648000
                }
            );

            res.cookie(
                "token",
                jwt,
                {
                    httpOnly: true,
                    secure: false
                }
            )

            res.redirect(process.env.FRONTEND_URL);
        }



        
        
    }catch(error){
        next(error);
    }
}

/*  login route for frontend, this route will be called by
    sign in / sign up button on frontend, it gets discrod oauth link
    from .env file and redirects user who made request to that link.

*/
export const loginController = (req: Request, res: Response, next: NextFunction) => {

    try{

        if(process.env.DISCORD_REDIRECT_URL){

            res.redirect(process.env.DISCORD_REDIRECT_URL);

        } else {

            throw new HttpException(500, "Discord redirect url not set up in .env");

        }

    }catch(error){
        next(error);
    }

}