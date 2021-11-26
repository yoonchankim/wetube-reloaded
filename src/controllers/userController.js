import User from "../models/User";
import bcrypt from "bcrypt"
export const getJoin =(req,res)=>{
    res.render("Join",{pageTitle:"Join"});
}
export const postJoin=async(req,res)=>{
    const name=req.body.name;
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    const password2=req.body.password2;
    const location=req.body.location;
    if(password!==password2){
        return res.status(400).render("Join",{pageTitle:"Join",errorMessage:"Password confirmation does not match"});  
    }
    const exists=await User.exists({$or:[{username},{email}]});
    if(exists){
        return res.status(400).render("Join",{pageTitle:"Join",errorMessage:"This username/email is already taken."});  
    }
    try{
        await User.create({name,username,email,password,location,});
        return res.redirect("/login");
    }
    catch(error){
        return res.status(404).render("join",{pageTitle:"Upload Video",errorMessage:error._message});
    }
}
export const edit =(req,res)=>res.send("Edit User");
export const remove =(req,res)=>res.send("Delete User");
export const getLogin=(req,res)=>{
    return res.render("login",{pageTitle:"Login"})
};
export const postLogin=async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const user=await User.findOne({username});
    if(!user){
        return res.status(400).render("login",{pageTitle:"Login",errorMessage:"An account with this username does not exists."})
    }   
    const ok=await bcrypt.compare(password,user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle:"Login",errorMessage:"Wrong password."});
    }
    req.session.loggedIn=true;
    req.session.user=user;
    return res.status(400).redirect("/");
};
export const startGithubLogin=(req,res)=>{
    const baseUrl='https://github.com/login/oauth/authorize';
    const config={
        client_id:"55c3cfda5e0a8e716916",
        allow_signup:false,
        scope:"read:user user:email"
    }
    const params=new URLSearchParams(config).toString();
    const finalUrl=`${baseUrl}?${params}`;
    return res.redirect(finalUrl);
    //https://github.com/login/oauth/authorize?client_id=55c3cfda5e0a8e716916&allow_signup=false&scope=user:email
};
export const finshGithubLogin=(req,res)=>{
    
};
export const logout=(req,res)=>res.send("Log Out");
export const see=(req,res)=>res.send("See User");
