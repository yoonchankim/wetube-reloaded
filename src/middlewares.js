export const localMiddleware=(req,res,next)=>{
    res.locals.loggedIn=Boolean(req.session.loggedIn);
    res.locals.siteName="wetube"
    res.locals.loggedInUsers=req.session.user||{};
    console.log(res.locals);
    next();
}