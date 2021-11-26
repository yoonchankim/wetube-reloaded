import express from "express"
import { edit, remove, logout, see,startGithubLogin,finshGithubLogin} from "../controllers/userController"
const userRouter=express.Router();
userRouter.get("/logout",logout);
userRouter.get("/edit",edit);
userRouter.get("/remove",remove);
userRouter.get("/github/start",startGithubLogin);
userRouter.get("/github/finsh",finshGithubLogin);
userRouter.get(":id",see);
export default userRouter;