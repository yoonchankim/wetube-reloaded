import Video from "../models/Video"
export const trending = async(req, res) =>{
  const videos=await Video.find({}); 
  console.log(videos);
  return res.render("home",{pageTitle : "Home",videos});
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
export const postUpload=async(req,res)=>{
  const title=req.body.title;
  const description=req.body.description;
  const hashtags=req.body.hashtags;
  try{await Video.create({
    title,
    description,
    hashtags:hashtags.split(",").map(word=>`#${word}`),
  });}
  catch(error){
    return res.render("upload",{pageTitle:"Upload Video",errorMessage:error._message});
  } 
  return res.redirect("/");
};
export const deleteVideo=(req,res)=>{
    return res.send("Delete Video");
}