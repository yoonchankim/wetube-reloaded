import User from "../models/User";
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
        return res.render("Join",{pageTitle:"Join",errorMessage:"Password confirmation does not match"});  
    }
    const exists=await User.exists({$or:[{username},{email}]});
    if(exists){
        return res.render("Join",{pageTitle:"Join",errorMessage:"This username/email is already taken."});  
    }
    await User.create({name,username,email,password,location,});
    return res.redirect("/login");
}
export const edit =(req,res)=>res.send("Edit User");
export const remove =(req,res)=>res.send("Delete User");
export const login=(req,res)=>res.send("Login");
export const logout=(req,res)=>res.send("Log Out");
export const see=(req,res)=>res.send("See User");