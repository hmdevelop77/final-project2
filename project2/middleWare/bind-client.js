module.exports=(req,res,next)=>{
    res.locals.client= req.user;
    next();
};
