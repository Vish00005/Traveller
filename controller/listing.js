const Listing = require("../model/listing.js");

module.exports.homeRoute = async (req, res) => {
  let data = await Listing.find({});
  res.render("../views/main/home.ejs", { data });
};

module.exports.searchRoute = async (req, res) => {
  let Search = req.query.Search;
  let data;
  const price = Number(Search);

  if (!isNaN(price)) {
    data = await Listing.find({
      price: { $lte: price },
    });
  } else {
    data = await Listing.find({
      $or: [
        { title: { $regex: Search, $options: "i" } },
        { location: { $regex: Search, $options: "i" } },
        { country: { $regex: Search, $options: "i" } },
      ],
    }).populate("owner");
  }

  res.render("../views/main/search.ejs", { data, Search });
};

module.exports.createGet = (req, res) => {
  res.render("../views/main/create.ejs");
};

module.exports.createPost = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Post Created");
  req.flash("error", "Post Not Created");
  res.redirect("/listings");
};

module.exports.editGet = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id).populate("owner");
  const user_id = req.user._id;
  if (!data) {
    req.flash("error", "Post does not exist");
    return res.redirect("/listings");
  }
  res.render("../views/main/edit.ejs", { data, user_id });
};

module.exports.editPut = async (req, res) => {
  let id = req.params.id;
  let { listing } = req.body;
  if (!listing) {
    throw new expressError(400, "Send valid Data");
  }
  let data = await Listing.findById(id);
  data.title= listing.title;
  data.description= listing.description;
  data. price= listing.price;
  data.location= listing.location;
  data.country= listing.country;
  
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    data.image = { url, filename };
    console.log("Uploaded")
  } 
  await data.save();
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id).populate("owner");

  req.flash("success", "Post Deleted");
  res.redirect("/listings");
};

module.exports.show = async (req, res, next) => {
  let id = req.params.id;
  let data = await Listing.find({ _id: id })
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(data);
  if (data.length == 0) {
    req.flash("error", "Post Does not Exist");
    res.redirect("/listings");
  } else {
    res.render("../views/main/show.ejs", { data });
  }
};
