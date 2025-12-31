const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const newdata = require("./initdb.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Traveller");
}
main()
  .then((res) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const initdata = async () =>{
    await Listing.deleteMany({});
    newdata.data =newdata.data.map((obj) => ({...obj,owner: '6948c6010413c18c48b077c7'}))
    await Listing.insertMany(newdata.data);
    console.log("Added");
}

initdata();