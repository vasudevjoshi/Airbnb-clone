const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const listings = require('./models/listing');
const ejsmate = require('ejs-mate');
const path = require('path');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError= require('./utils/ExpressError');
const {listingSchema,reviewSchema} = require('./schema.js');

app.use((express.urlencoded({extended: true})));
app.set('view engine', 'ejs');
app.set("views",(path.join(__dirname, 'views')));

app.engine('ejs', ejsmate);
const methodOverride = require('method-override');
const review = require('./models/review');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
main()
.then(() => {
console.log("connected to database")})
.catch((err) => {
    console.error(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.get('/', (req, res) => {
    res.send("working succcessfully");
    console.log("working successfully");
});

const validateListing =(req,res,next) =>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

const validateReview =(req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        res.render('./listings/error.ejs',{error});
        
        // throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

// index route
app.get('/listings',wrapAsync(async (req, res) => {
   const allListings = await listings.find({});
   res.render('./listings/index.ejs',{allListings});

}));
app.get('/listings/new', async (req, res) => {
    
    res.render('./listings/new.ejs');
 
 });
 // create route
 app.post('/listings', wrapAsync(async (req, res,next) => {
     let result = listingSchema.validate(req.body);
        if(result.error){
            throw new ExpressError(result.error,400);
        let newlistings = req.body.listing;
        const newlisting = new listings(newlistings);
        await newlisting.save();
        res.redirect('/listings');

 }
 }));
        
 

app.get('/listings/:id', wrapAsync(async (req, res) => {
    let {id } = req.params;
    const listing = await listings.findById(id).populate("reviews");
    res.render('./listings/show.ejs',{listing});
 
 }));
 app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let {id } = req.params;
    const listing = await listings.findById(id);
    res.render('./listings/edit.ejs',{listing});
 
 }));

 app.put('/listings/:id', wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError("Invalid listing data",400);
    }
    let {id} = req.params;
    const listing = await listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
 }));

 // delete the listing
 app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await listings.findByIdAndDelete(id);
    console.log(listing);
    res.redirect('/listings');
 }));



//  app.all("*",(req,res,next)=>{
//     next(new Error("Page not found",404));
//  })
app.use((err,req,res,next)=>{
    let{message,statusCode } = err;
    res.render('error.ejs',{err});
});


// review routes
app.post('/listings/:id/reviews',validateReview ,wrapAsync(async (req, res) => {
    let listing = await listings.findById(req.params.id);
    let newReview = new review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing._id}`);
}));

// delete the reviews

    app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
        let {id, reviewId} = req.params;
        await listings.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
        await review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    }));
app.get('/testListings',async (req,res)=>{
    let samplelisting = new listings({
        title: "my home",
        description: "by the beach",
        price: 1200,
        location: "bijapur",
        country: "india",
    });
    await samplelisting.save()
    .then(()=>{console.log("listing saved"); })
    .catch((err)=>{console.error(err);});
    res.send("listing saved successgfully");
});
app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});