import { NextFunction, Request, Response } from "express";

export const authenticateDev = async (req: Request, res: Response, next: NextFunction) => {

    try{

        if(process.env.DEV_PAGE_AUTH === "off"){
            next();
        } else {
            if(!req.headers.cookie){
                res.redirect("/dev");
            } else {
                if(process.env.DEV_PAGE_PASSWORD){
            
                    const valid = req.session.loggedIn;
            
                    if(!valid){

                        res.status(401).redirect("/dev");
    
                    }else{
                        next();
                    }
                }
            }
        }

        
    
        
    } catch(error){
        res.send("500, middleware error");
    }
}

