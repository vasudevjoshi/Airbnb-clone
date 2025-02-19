const listings = require('./models/listing');
const review = require('./models/review');
const {listingSchema} = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.session);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Logged in");
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
    next();
}


module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await listings.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
       req.flash("error", "You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    const requsetedreview = await review.findById(reviewId);
    if(!requsetedreview.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();

};