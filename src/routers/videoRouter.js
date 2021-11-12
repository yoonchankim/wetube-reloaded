import express from "express"
import {postUpload, watch, getEdit, upload, deleteVideo,postEdit} from "../controllers/videoController"
const videoRouter=express.Router();
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.route("/upload").get(upload).post(postUpload);
export default videoRouter;