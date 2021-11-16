import Video from "../models/Video"
export const trending = (req, res) =>{
    Video.find({},(error,videos)=>{});
    res.render("home",{pageTitle : "Home"});
} 
export const watch=(req,res)=>{
  const id=req.params.id;
  return res.render("watch",{pageTitle : `watching`});
} 
export const getEdit=(req,res)=>{
  const id=req.params.id;
  return res.render("edit",{pageTitle:`Editing`})
};
export const postEdit=(req,res)=>{
  const id=req.params.id;
  const title=req.body.title;
  return res.redirect(`/videos/${id}`);
};
export const search=(req,res)=>res.send("Search");
export const upload=(req,res)=>{
  return res.render("upload",{pageTitle:"Upload Video"});
};
export const postUpload=(req,res)=>{
  return res.redirect("/");
};
export const deleteVideo=(req,res)=>{
    return res.send("Delete Video");
}