const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
// const Profile = require("../db/ProfileDetails")
const bcrypt = require('bcrypt')
const router = express.Router();

// Signup Routing
router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
    phone:data.contactNumber
  });
  
    user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              companyname: data.name,
              contactNumber: data.contactNumber,
              email:data.email,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              email:data.email,
              education: data.education,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,
              profile: data.profile,
              contactNumber: data.contactNumber,
            });

          //   const ProfileDetails = 
          //   new Profile({
          //    userId: user._id,
          //    profilename:data.name
          //  });
          //  ProfileDetails.save()

      userDetails
        .save()
        .then(() => {
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({err:"User Already Exists"});
    });

});


// Login Routing
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

// MobileLogin Routing
router.post("/mobilelogin", (req, res) => {
  const {phone} = req.body;
    console.log(phone)
    if(!phone){
       return res.status(422).json({error:"Please fill all the fields"})
    }else{
         User.findOne({phone}).then((savedUser)=>{
            if(!savedUser){
                res.status(422).json({error:"User not exist"})  
            }
            else{
                // res.status(200).json({message:"Login success"}) 
                const token = jwt.sign({ _id: savedUser._id }, authKeys.jwtSecretKey);
                res.json({
                  token: token,
                  type: savedUser.type,
                }); 
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
});




// Flutter Login Routing
router.post("/loginflutter",(req,res)=>{
  const {email,password} = req.body
  if(!email||!password){
    return res.status(422).json({error:"Please fill all the fields"})
  }else{
    User.findOne({email}).then((savedUser)=>{
       if(!savedUser){
           res.status(422).json({error:"Invalid email or password"})  
       }
       else{
           bcrypt.compare(password,savedUser.password).then((doMatch)=>{
               if(doMatch){
                res.status(200).json({message:"Login Successful"})
               }
               else{ 
                   res.status(422).json({error:"Invalid email or password"})
               }
           }).catch((err)=>{
               console.log(err)
           })
       }
   }).catch((err)=>{
       console.log(err)
   })
}
})

module.exports = router;
