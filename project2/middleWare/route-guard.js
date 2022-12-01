const isLoggedIn = (req,res,next)=>{
    if(!req.session.currentUser){
        return res.redirect("/client/login");
    }
    next();
}

const isLoggedOut = (req,res,next )=>{
    if(req.session.currentUser){
        return res.redirect("/");
    }
    next();
}

module.exports={ isLoggedIn, isLoggedOut}