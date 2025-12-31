const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const reviewSchema = new Schema({
    user:{
        type:String,
        default:"Anonymous"
    },
    comment:String,
    rating:{type:Number,max:5,min:1},
    created_at : {
        type:Date,
        default:Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});
const Review = mongoose.model("Review",reviewSchema);

// Review.insertMany(
//     [
//         { rating: 4, comment: "Great location, minor issues with cleanliness." },
//         { rating: 3.5, comment: "Comfortable stay, staff was helpful." },
//         { rating: 2.5, comment: "Expected more for the price paid." },
//         { rating: 4.5, comment: "Exceptional hospitality and views!" },
//         { rating: 2, comment: "Would not recommend. Poor service." }
//       ]
// )

module.exports = Review;