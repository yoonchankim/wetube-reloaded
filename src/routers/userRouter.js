import express from "express"
import { getEdit,postEdit, remove, logout, see,startGithubLogin,finshGithubLogin,postChangePassword,getChangePassword} from "../controllers/userController"
import {protectorMiddleware,publicOnlyMiddleware} from "../middlewares"
const userRouter=express.Router();
userRouter.get("/logout",protectorMiddleware,logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/remove",remove);
userRouter.get("/github/start",publicOnlyMiddleware,startGithubLogin);
userRouter.get("/github/finsh",publicOnlyMiddleware,finshGithubLogin);
userRouter.get(":id",see);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
export default userRouter;