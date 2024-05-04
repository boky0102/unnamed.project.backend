import {NextFunction, Router} from "express";
import { authController, loginController } from "../controllers/auth.controller";
import {Response, Request} from "express";
import {authenticate} from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.get("", authController);

authRouter.get("/login", loginController);


/*

    Test route for protected endpoint, you can use authenticate middleware on all
    routes that need protection and authentication will be handled automatically.

*/
authRouter.get("/protected", [authenticate] , async (req: Request, res: Response, next: NextFunction) => {
    try{

        const userId = req.userID;
        console.log(userId);
        res.status(200).send({
            id: userId
        });
    }catch (error){
        next(error)
    }
    
})