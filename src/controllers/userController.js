import User from "../models/User";
import bcrypt from "bcrypt"
import { application } from "express";
import fetch from "node-fetch"
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
export const getEdit =(req,res)=>{
return res.render("edit-profile",{pageTitle:"Edit Profile"})
};
export const postEdit=async(req,res)=>{
  const id=req.session.user._id
  const name=req.body.name;
  const email=req.body.email;
  const username=req.body.username;
  const location=req.body.location;
  const avatarUrl=req.body.avatarUrl;
  const file=req.file;
  console.log("file",file)
  //email,username 유니크 에러 코드 챌린지
  const findEmail=await User.findOne({email});
  const findUsername=await User.findOne({username});
  if(findEmail._id!=id||findUsername._id!=id){
    return res.render("edit-profile",{pageTitle:"Edit Profile",errorMessage:"This username/email is already taken."})
  }
  //session이랑 비교해서 email,username이 바뀌었으면 exists({조건}) exists==true면 에러 뛰우고 아니면 계속 진행
  //뒤에서 하면 안되는 이유:username,email이 이미 이 계정으로 바뀌었는데 있는지 찾아보면 자기 것이 있어서 당연히 존재한다고해서 에러 나옴
  const updatedUser=await User.findByIdAndUpdate(id,{
    avatarUrl:file?file.path:avatarUrl
    ,name,email,username,location
  },{new:true})
  req.session.user=updatedUser;
  return res.redirect("/users/edit");
  };
export const remove =(req,res)=>res.send("Delete User");
export const getLogin=(req,res)=>{
    return res.render("login",{pageTitle:"Login"})
};
export const postLogin=async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const user=await User.findOne({username,socialOnly:false});
    if(!user){
        return res.status(400).render("login",{pageTitle:"Login",errorMessage:"An account with this username does not exists."})
    }   
    const ok=await bcrypt.compare(password,user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle:"Login",errorMessage:"Wrong password."});
    }
    req.session.loggedIn=true;
    req.session.user=user; //findByIdUpdate해도 업데이트 안되는 이유 :pug파일에서 가져오는 locals는 session에서 가져오고 sessions는 로그인할때 저장되서 db만 바뀌고 pug파일에서 가져오는 local는 업데이트 되지 않는다. #8.3에서 이 에러 수정
    return res.status(400).redirect("/");
};export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout=(req,res)=>{
    req.session.destroy();
    return res.redirect("/");
};
export const getChangePassword=(req,res)=>{
  return res.render("change-password",{pageTitle:"Change Password"});
}

export const postChangePassword=async(req,res)=>{
  const _id=req.session.user._id;
  const password=req.session.user.password;
  const oldPassword=req.body.oldPassword;
  const newPassword=req.body.newPassword
  const newPasswordConfirmation=req.body.newPasswordConfirmation;
  if(newPassword!==newPasswordConfirmation){
    return res.status(400).render("change-password",{pageTitle:"Change Password",errorMessage:"new password does not match with confirmation"});
  }
  const ok=await bcrypt.compare(oldPassword,password);
  if(!ok){
    return res.status(400).render("change-password",{pageTitle:"Change Password",errorMessage:"old password does not match with confirmation"});
  }
  const user=await User.findById(_id);
  user.password=newPassword
  console.log(user.password);
  await user.save();
  req.session.user.password=user.password
  console.log(user.password);
  return res.redirect("/users/logout")
}
export const see=async(req,res)=>{
  const id=req.params.id;
  const user=await User.findById(id);
  if(!user){
    return res.status(404).render("404",{pageTitle:"user not found"});
  }
  return res.render("profile",{pageTitle:`${user.name}`,user})
};
