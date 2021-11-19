import express from "express"
import {postUpload, watch, getEdit, upload, deleteVideo,postEdit} from "../controllers/videoController"
const videoRouter=express.Router();
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.route("/upload").get(upload).post(postUpload);
export default videoRouter;