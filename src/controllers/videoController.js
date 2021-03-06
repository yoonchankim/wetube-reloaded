import Video from "../models/Video"
import User from "../models/User";
export const trending = async(req, res) =>{
  const videos=await Video.find({}).sort({createdAt:"desc"}); 
  return res.render("home",{pageTitle : "Home",videos});
} 
export const watch=async(req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id).populate("owner");
  if(video===null){
    return res.render("404",{pageTitle:"Video Not Found"});
  }
  return res.render("watch",{pageTitle:video.title,video});
} 
export const getEdit=async(req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id);
  if(video===null){
    return res.status(404).render("404",{pageTitle:"Video Not Found"});
  }
  if(String(video.owner)!==String(req.session.user._id)){
    return res.status(403).redirect("/");
  }
  return res.render("edit",{pageTitle:`Edit "${video.title}"`,video})
};
export const postEdit=async(req,res)=>{
  const id=req.params.id;
  const title=req.body.title;
  const description=req.body.description;
  const hashtags=req.body.hashtags;
  const video=await Video.exists({_id:id});
  if(!video){
    return res.status(404).render("404",{pageTitle:"Video Not Found"});
  }
  if(String(video.owner)!==String(req.session.user._id)){
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id,{
    title,description,hashtags:Video.formatHashtags(hashtags)
  })
  return res.redirect(`/videos/${id}`);
};
export const search=async(req,res)=>{
  const keyword=req.query.keyword;
  let videos=[];
  if(keyword){
    videos=await Video.find({
      title:{
        $regex:new RegExp(keyword,"i")
      }
    })
  }
  return res.render("search",{pageTitle:"Search",videos});
};
export const upload=(req,res)=>{
  return res.render("upload",{pageTitle:"Upload Video"});
};
export const postUpload=async(req,res)=>{
  const _id=req.session.user._id;
  const file=req.file;
  const title=req.body.title;
  const description=req.body.description;
  const hashtags=req.body.hashtags;
  try{const newVideo=await Video.create({
    title,
    description,
    fileUrl:file.path,
    owner:_id,
    hashtags:Video.formatHashtags(hashtags)
    });
    const user=await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
  }
  catch(error){
    return res.status(404).render("upload",{pageTitle:"Upload Video",errorMessage:error._message});
  } 
  return res.redirect("/");
};
export const deleteVideo=async(req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id);
  if(!video){
    return res.status(404).render("404",{pageTitle:"Video Not Found"});
  } 
  if(String(video.owner)!==String(req.session.user._id)){
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}