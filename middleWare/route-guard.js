// const isLoggedIn = (req,res,next)=>{
//     if(!req.session.currentUser){
//         return res.redirect("/client/login");
//     }
//     next();
//}

// const isLoggedOut = (req,res,next )=>{
//     if(req.session.currentUser){
//         return res.redirect("/");
//     }
//     next();
// }

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/client/login");
    }
    next();
}


const isLoggedOut = (req,res,next )=>{
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    next();
}


// const isAdmin = (req,res,next)=>{
//     if(req.session.currentUser.admin){
//         return res.redirect("/client/create")
//     }
// }
// const isNotAdmin = (req,res,next)=>{
//     if(!req.session.currentUser.admin){
//         return res.redirect("/")   // create and use de redirect for  section all audio 
//     }
// }


module.exports={ isLoggedIn, isLoggedOut}

//module.exports={ isAdmin, isNotAdmin}