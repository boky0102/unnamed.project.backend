
import * as jwt from "jsonwebtoken"

export type DiscordAuthData = {
    token_type: string,
    access_token: string,
    refresh_token: string,
    expires_in: number,
    scope: string
}

export interface DiscordUserData {
    id: string,
    username: string,
    avatar: string
}

export interface UserAuthData extends DiscordUserData {
    refresh_token: string,
}

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: string
    
    }
}

declare module "express-session" {
    interface SessionData {
        loggedIn: boolean
    }
}


declare global {
    namespace Express {
      export interface Request {
        userID: string;
      }
    }
  }