import {DiscordAuthData, DiscordUserData, UserAuthData} from "../Types/authType";
import {HttpException} from "../Types/error";

/*
    This is a service that fetches access and refresh token from the discord
    server, in the case fetched user doesn't exist, it creates new user by 
    saving it into the database.

    In both scenarios cookie is created that contains jwt signature which frontend
    can use to fetch data from protected endpoints. Jwp payload contains user id which
    is attached to request object, it can be used in any controller that uses
    authentication middleware by calling req.userId

*/

export const getDataFromDiscord = async (code: string): Promise<UserAuthData> => {

    // checking if .env files contain variables
    if(process.env.DISCORD_OAUTH_ID && process.env.DISCORD_SECRET){

        let redirectURI;
        if(process.env.APP_MODE === "prod"){
            redirectURI = "https://unnamedapp-cf0ce93cede1.herokuapp.com/auth"
        } else{
            redirectURI = "https://localhost:3000/auth"
        }
        

        const body = new URLSearchParams({
            client_id: process.env.DISCORD_OAUTH_ID,
            client_secret: process.env.DISCORD_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectURI
        }).toString();


        // getting acces token from discord oauth server
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })

        const authData: DiscordAuthData = await response.json();

        const startTime = new Date().getTime()

        /* getting user data using access token obtained previously from
           discord api */ 
        const userDataResponse = await fetch('https://discord.com/api/users/@me', {
            method: "GET",
            headers: {
                'Authorization' : `${authData.token_type} ${authData.access_token}`
            }
        });


        const discordUserData: DiscordUserData = await userDataResponse.json();

        // making avatar url from user info provided by discord
        const avatarURL = `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.png`;

        const userData: UserAuthData = {
            id: discordUserData.id,
            avatar: avatarURL,
            username: discordUserData.username,
            refresh_token: authData.refresh_token
        }

        return userData;
    }

    throw new HttpException(500, ".env file isn't set up properly");

}