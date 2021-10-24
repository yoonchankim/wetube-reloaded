import express from "express"
import morgan from "morgan"
const logger=morgan("dev");
const PORT=4000;
const app=express();
const login=(req,res,next)=>{
    return res.send("login");
}

const home=(req,res)=>{
    return res.send("home");
}
app.use(logger);
app.get("/",home);
app.get("/login",login);
const handleListening=()=>console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT,handleListening);
