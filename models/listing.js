const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviews = require('./review.js');

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        image: {
            type : String,
            default: "https://unsplash.com/photos/blue-body-of-water-in-front-of-building-near-trees-during-nighttime-M7GddPqJowg",
            set: (v) => v=== ""? "https://unsplash.com/photos/blue-body-of-water-in-front-of-building-near-trees-during-nighttime-M7GddPqJowg": v, 
        },
        price: Number,
        location: String,
        country: String,
        reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
    }
);

listingSchema.post('findOneAndDelete', async(listing) =>{
    if(listing){
        await reviews.deleteMany({
            _id:{
                $in: listing.reviews
            }
        })
    }
});
const listing  = mongoose.model('listing', listingSchema);

module.exports = listing;