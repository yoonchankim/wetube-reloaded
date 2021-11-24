import express from "express"
import { trending, search } from "../controllers/videoController"
import { getJoin, postLogin,postJoin,getLogin } from "../controllers/userController"
const rootRouter=express.Router();
rootRouter.get("/",trending);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search",search);
export default rootRouter; 