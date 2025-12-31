//----------------------------------Required----------------------------------
require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3001;
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const expressError = require("./util/expressError.js");
const LocalString = require("passport-local");
const User = require("./model/user.js");
const listingroutes = require("./routes/listingroutes.js");
const reviewroutes = require("./routes/reviewroutes.js");
const userroutes = require("./routes/userroutes.js");



//----------------------------------EJS view engine----------------------------------
app.set("views");
app.set("view engine", "ejs");

//----------------------------------decoding post----------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//----------------------------------Static files location----------------------------------
app.use(express.static("public"));

//----------------------------------Method Overriding----------------------------------
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//----------------------------------Session Options----------------------------------



const sessionOptions = {
  store : MongoStore.create({
    mongoUrl : process.env.ATLAS_DB_URL,
    crypto:{
      secret : process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 60 * 60,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*3,
    maxAge: 1000*60*60*24*3
  }
};
app.use(session(sessionOptions));


//----------------------------------Passport pkg----------------------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalString(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//----------------------------------Flash----------------------------------
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
})



//----------------------------------Mongoose Connection----------------------------------
async function main() {
  await mongoose.connect(process.env.ATLAS_DB_URL);
}
main()
  .then((res) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, (req, res) => {
  console.log(`Listening At ${port}`);
});

//----------------------------------Root route----------------------------------
app.get("/", (req, res) => {
  res.send("ROOT Directory");
});

app.get("/sample", (req, res) => {
  throw new expressError(404, "Route Not Found");
  res.send("saved");
});

//----------------------------------Fake User----------------------------------
// app.get("/demouser",async (req,res,next)=>{
//   let fakeUser = new User({
//       email: "hello@gmail.com",
//       username : "hello"
//     });
//   let register = await User.register(fakeUser,"hellp");
//   res.send(register);
// })
//----------------------------------listing routes----------------------------------
app.use("/listings", listingroutes);

//----------------------------------Review routes----------------------------------
app.use("/listings/:id/reviews", reviewroutes);

//----------------------------------User routes----------------------------------
app.use("/", userroutes);

//----------------------------------Error Handling----------------------------------
app.use((req, res, next) => {
  next(new expressError(404, "Route Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.render("./main/error.ejs", { status, message });
});
