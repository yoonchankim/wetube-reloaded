import express from "express"
import {postUpload, watch, getEdit, upload, deleteVideo,postEdit} from "../controllers/videoController"
import {protectorMiddleware,publicOnlyMiddleware,videoUpload} from "../middlewares"
const videoRouter=express.Router();
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(upload).post(videoUpload.single("video"),postUpload);
export default videoRouter;