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
const nodemailer = require("nodemailer");
const cors = require("cors");

// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});
app.use(cors());

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


const dbUrl = process.env.MONGO_URL;


if (!dbUrl) {
  throw new Error("Database URL is not defined");
}

const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 60 * 60,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
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
  await mongoose.connect(dbUrl);
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
  res.redirect('/listings');
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

app.post("/booking",async (req, res) => {
  try {
    const { destination,name, email, datefrom, dateto, adult,children,senior,totaldays,totalprice } = req.body;

    if (!destination || !name || !email || !datefrom || !dateto || !children || !adult || !senior  || !totaldays || !totalprice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bookingId = "TRV" + Math.floor(100000 + Math.random() * 900000);

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: green;">Booking Confirmed ✅</h2>

        <p>Hello <b>${name}</b>,</p>
        <p>Your travel booking has been successfully confirmed.</p>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr><td><b>Booking ID</b></td><td>${bookingId}</td></tr>
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Destination</b></td><td>${destination}</td></tr>
          <tr><td><b>From</b></td><td>${datefrom}</td></tr>
          <tr><td><b>To</b></td><td>${dateto}</td></tr>
          <tr><td><b>Adults</b></td><td>${adult}</td></tr>
          <tr><td><b>Childrens</b></td><td>${children}</td></tr>
          <tr><td><b>Seniors</b></td><td>${senior}</td></tr>
          <tr><td><b>Total Days</b></td><td>${totaldays}</td></tr>
          <tr><td><b>Amount Paid</b></td><td>${totalprice}</td></tr>
        </table>

        <p style="margin-top:15px;">Have a safe and happy journey! ✈️</p>
        <p>Customer Support: +91-9999999999</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Travel Booking" <YOUR_EMAIL@gmail.com>`,
      to: email,
      subject: "Your Travel Booking Confirmation",
      html: htmlTemplate
    });

    res.redirect("/listings")

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email sending failed" });
  }
}
)

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
