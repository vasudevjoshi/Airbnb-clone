const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError= require('../utils/ExpressError');
const {listingSchema,reviewSchema} = require('../schema.js');
const review = require('../models/review');

const {isLoggedIn,isReviewAuthor} = require('../middleware');
const controllerReview = require('../controllers/review');
const validateReview =(req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        res.render('./listings/error.ejs',{error});
    }
    else{
        next();
    }
};
router.post('/',validateReview,isLoggedIn,wrapAsync(controllerReview.createReview));

// delete the reviews

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,wrapAsync(controllerReview.destroyReview));

module.exports = router;