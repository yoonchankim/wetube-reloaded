import Video from "../models/Video"
export const trending = async(req, res) =>{
  const videos=await Video.find({}); 
  return res.render("home",{pageTitle : "Home",videos});
} 
export const watch=async(req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id);
  if(video===null){
    return res.render("404",{pageTitle:"Video Not Found"});
  }
  return res.render("watch",{pageTitle:video.title,video});
} 
export const getEdit=async(req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id);
  if(video===null){
    return res.render("404",{pageTitle:"Video Not Found"});
  }
  return res.render("edit",{pageTitle:`Edit "${video.title}"`,video})
};
export const postEdit=async(req,res)=>{
  const id=req.params.id;
  const title=req.body.title;
  const description=req.body.description;
  const hashtags=req.body.hashtags;
  const video=await Video.exist({_id:id});
  if(!video){
    return res.render("404",{pageTitle:"Video Not Found"});
  }
  await Video.findByIdAndUpdate(id,{
    title,description,hashtags:hashtags.split(",").map((word)=>(word.startsWith(`#`)?word:`#${word}`))
  })
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
    hashtags:hashtags.split(",").map((word)=>(word.startsWith(`#`)?word:`#${word}`)),
  });}
  catch(error){
    return res.render("upload",{pageTitle:"Upload Video",errorMessage:error._message});
  } 
  return res.redirect("/");
};
export const deleteVideo=(req,res)=>{
    return res.send("Delete Video");
}