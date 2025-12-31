const User = require("../model/user.js");

module.exports.signupGet = (req, res) => {
    res.render("../views/user/signup.ejs");
    // res.send("signup");
  }

module.exports.signupPost = async (req, res) => {
    let signupdata = req.body.signupdata;
    try {
      const newUser = new User({
        email: signupdata.email,
        username: signupdata.username,
      });
      await newUser.setPassword(signupdata.password);
      await newUser.save();
      req.login(newUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Have Logged In");
        res.redirect("/listings")
    });
} catch {
  req.flash("error", "User is already registered");
  res.redirect("/signup");
}
}

module.exports.loginGet =(req, res) => {
    res.render("../views/user/login.ejs");
  }

// passwordValidatorAsync = function (password) {
//   return someAsyncValidation(password).catch(function (err) {
//     return Promise.reject(err);
//   });
// };

module.exports.loginPost = async (req, res) => {
    req.flash("success","Welcome To Traveller")
    if(res.locals.redirectUrl){
        console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings")
    }
  }

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Have Logged Out");
        res.redirect("/listings")
    })
}