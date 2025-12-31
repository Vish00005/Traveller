const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const expressError = require("../util/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn , isOwner } = require("../util/isLoggedIn.js");
const  listingroutes = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const Listing = require("../model/listing.js");

const validatelisting = (req, res, next) => {
  let rslt = listingSchema.validate(req.body);
  // console.log(rslt);
  if (rslt.error) {
    throw new expressError(400, rslt.error.message);
  }
  next();
};

//----------------------------------Home route----------------------------------
router.get(
  "/",
  wrapAsync(listingroutes.homeRoute)
);

//----------------------------------Search route----------------------------------
router.get(
  "/search",
  wrapAsync(listingroutes.searchRoute)
);

//----------------------------------Create route----------------------------------
router.get("/create", isLoggedIn , listingroutes.createGet);
router.post(
  "/",
  isLoggedIn ,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingroutes.createPost)
);
//----------------------------------Booking route----------------------------------

router.get("/booking/:id",isLoggedIn,  wrapAsync( async (req,res)=>{
  let id = req.params.id;
  let data = await Listing.find({ _id: id })
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(data);
  if (data.length == 0) {
    req.flash("error", "Post Does not Exist");
    res.redirect("/listings");
  } else {
    res.render("../views/main/booking.ejs", { data });
  }
})
);

//----------------------------------Edit route----------------------------------
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingroutes.editGet)
);

router.put(
  "/:id",
  isLoggedIn ,
  isOwner,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingroutes.editPut)
);

//----------------------------------Delete route----------------------------------
router.delete(
  "/:id",  
  isLoggedIn,
  isOwner,
  wrapAsync(listingroutes.delete)
);

//----------------------------------Show route---------------------------------
router.get(
  "/:id",
  wrapAsync(listingroutes.show)
);

module.exports = router;
