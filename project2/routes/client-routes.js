const express = require('express');
//const bcrypt = require("bcryptjs");
const router = express.Router();
const Client = require ('../models/client-model');
const mongoose = require("mongoose");


router.get("/client/signup",(req,res,next)=>{
try {
    res.render("./client/sign-client")
} catch (error) {
    next(error)
}
});
router.post("/client/signup",async(req,res,next)=>{
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.render("./client/sign-client", {
              errorMessage: "All field are required",
            });
          }
          await Client.create({ username, email, password } )
          res.redirect("/profile")
    } catch (error) {
        next(error)
    }
})
router.get("/profile", (req, res, next) => {
    try {
        const{username} = req.session;
      res.render("./client/profil-client");
    } catch (error) {
      next(error);
    }
  });
  router.get("/client/login", (req, res, next) => {
    try {
      res.render("./client/login-client");
    } catch (error) {
      next(error);
    }
  });
router.post("/client/login",async(req,res,next)=>{
    try {
        const { username, password } = req.body;
        console.log("--> Session",req.session)
        if (username === "" || password === "") {
            return res.render("./client/login-client", {
              errorMessage: "Please enter both username and password.",
            });
          }
          const client = await Client.findOne({ username });
          if (!client) {
            return res.render("./client/login-client", {
              //when we are expecting an error we put return
              errorMessage: "User is not registered",
            });
          }else{
              req.session.currentUser = client;
             res.redirect("/profile");  
          }
    } catch (error) {
        next(error)
    }
})





module.exports = router;

