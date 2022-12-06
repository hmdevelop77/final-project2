const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Client = require("../models/client-model");
const File = require("../models/file-model");
const fileUploader = require("../config/cloudinary.config");

const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleWare/route-guard");
const passport = require("passport");

const saltRounds = 10;

router.get("/client/signup", isLoggedOut, (req, res, next) => {
  try {
    res.render("./client/sign-client");
  } catch (error) {
    next(error);
  }
});
router.post("/client/signup", isLoggedOut, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render("./client/sign-client", {
        errorMessage: "All field are required",
      });
    }
      const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm; //password validating with uppercase number ....
    if (!passwordRegex.test(password)) {
      return res.status(500).render("./client/sign-client", {
        errorMessage:
          "Password needs to be at least 6 characters and must contain one uppercase letter, one lowercase letter, a number and a special character.",
      });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    await Client.create({ username, email, passwordHash });
    res.redirect("/client/profile");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("./client/sign-client", { errorMessage: error.message }); // to fill everything
      } else if (error.code === 11000) {
        // to check if it exist
        res.status(500).render("./client/sign-client", {
          errorMessage: "User or email already in use.",
        });
      } else {
    next(error);
  }
   };
});
router.get("/client/profile", isLoggedIn, (req, res, next) => {
  try {
    
   //console.log(req.session);
    res.render("./client/profil-client");
  } catch (error) {
    next(error);
  }
});
router.post("/client/profile",isLoggedIn,async(req,res,next)=>{
  try {
    const {newUsername,oldPassword,newPassword} = req.body
    const client = req.user;
    const profile= await Client.findById(client._id)
   // if(oldPassword === "" && newPassword ===""){
  // const clientUpdated = await Client.findByIdAndUpdate(client._id, {username:newUsername})
   // }else{
     if(bcrypt.compareSync(oldPassword,profile.passwordHash)){
//hash the password
   const passwordRegex =
/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm; //password validating with uppercase number ....
if (!passwordRegex.test(newPassword)) {
return res.status(500).render("./client/sign-client", {
  errorMessage:
    "Password needs to be at least 6 characters and must contain one uppercase letter, one lowercase letter, a number and a special character.",
});
}
const salt = await bcrypt.genSalt(saltRounds);
const newPasswordHash = await bcrypt.hash(newPassword, salt);
const newProfile= await Client.findByIdAndUpdate(client._id, {username:newUsername, passwordHash: newPasswordHash})
    }else {
      res.render("auth/login", { errorMessage: "Incorrect password." });
    } 
    res.redirect(`/client/profile`)
  } catch (error) {
    next(error)
  }
}
)

router.get("/client/login", isLoggedOut, (req, res, next) => {
  try {
    res.render("./client/login-client");
  } catch (error) {
    next(error);
  }
});
// router.post("/client/login", isLoggedOut, async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     //console.log("--> Session",req.session)
//     if (email === "" || password === "") {
//       return res.render("./client/login-client", {
//         errorMessage: "Please enter both email and password.",
//       });
//     }
//     const client = await Client.findOne({ email });
//     if (!client) {
//       return res.render("./client/login-client", {
//         errorMessage: "User is not registered",
//       });
//     } else if (bcrypt.compareSync(password, client.passwordHash)) {
//       req.session.currentUser = client;
//       res.redirect("/client/profile");
//     } else {
//       res.render("./client/login-client", {
//         errorMessage: "Incorrect password.",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// });
router.post("/client/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;
  //console.log("--> Session",req.session)
  if (email === "" || password === "") {
    return res.render("./client/login-client", {
      errorMessage: "Please enter both email and password.",
    });
  };
  passport.authenticate("local", (error, client, failureDetails) => {
    if (error) {
      // something went wrong authenticating the client
      return next(error);
    }
    if (!client) {
      //Unauthorized, "faillureDetails" will contain the reason
      return res.render("./client/login-client", {
        //{errorMessage: failureDetails.message}
        errorMessage: "wrong password or username",
      });
    }
    req.login(client, error => {
      if (error) {
        //saving the session went wrong
        return next(error);
      }
      //everything went good redirecting user
      res.redirect("/client/profile");
    });
  })(req, res, next);
});

// router.post("/client/logout", (req, res, next) => {
//   req.session.destroy((error) => {
//     if (error) {
//       next(error);
//     }
//     res.redirect("/");
//   });
// });

router.post("/client/logout", (req, res, next) => {
  req.logout(error => {
    if (error) {
      next(error);
    }
    res.redirect("/");
  });
});
//routes for google auth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get("/auth/google/callback",passport.authenticate("google",{
  successRedirect:`${process.env.APP_HOSTNAME}/client/profile`,      // check this url
  failureRedirect:`${process.env.APP_HOSTNAME}/client/login`        // check this url also
}))

router.get("/client/create", isLoggedIn, async (req, res, next) => {
  try {
    const audio = await File.find();
    // console.log("this is our audio:",audio[0].file)
    res.render("./client/create-audios", { audio });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/client/create",
  isLoggedIn,
  fileUploader.single("file"),
  async (req, res, next) => {
    try {
      // console.log("request file", req.file);
      const { title } = req.body;
      const audio = { title, file: req.file.path };
      const newFile = await File.create(audio);
      // console.log("Audio created:", newFile.title);
      res.redirect("/client/create");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/client/audios", isLoggedIn, async (req, res, next) => {
  try {
    const audio = await File.find();
    // console.log("this is our audio:",audio[0].file)
    res.render("./client/audios-client", { audio });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
