const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    img:{
        type:String,
        default:
      "../public/user-solid-full.svg",
    set: (v) => {
      return v === "" || v === undefined
        ? "../public/user-solid-full.svg"
        : v;
    }
    },
    Dob:{
        type:Date
    },
    // username :{
    //     type:String,
    //     required:true,     //////////This both fields are by Default created by "passport-local-mongoose"
    //     unique:true
    // },
    // password:{
    //     type:String,
    //     required:true
    // }
})
// console.log(typeof passportLocalMongoose)
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);


module.exports = User;