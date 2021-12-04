import express from "express"
import { trending, search } from "../controllers/videoController"
import { getJoin, postLogin,postJoin,getLogin } from "../controllers/userController"
import {protectorMiddleware,publicOnlyMiddleware} from "../middlewares"
const rootRouter=express.Router();
rootRouter.get("/",trending);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search",search);
export default rootRouter; 