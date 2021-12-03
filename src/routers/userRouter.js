import express from "express"
import { getEdit,postEdit, remove, logout, see,startGithubLogin,finshGithubLogin} from "../controllers/userController"
const userRouter=express.Router();
userRouter.get("/logout",logout);
userRouter.route("/edit").get(getEdit).get(postEdit);
userRouter.get("/remove",remove);
userRouter.get("/github/start",startGithubLogin);
userRouter.get("/github/finsh",finshGithubLogin);
userRouter.get(":id",see);
export default userRouter;