const express = require("express");
const router = express.Router();
const listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware");
const controllerListing = require("../controllers/listing");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
 
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.route("/")
.get(wrapAsync(controllerListing.index))
.post(
  isLoggedIn,upload.single('listing[image]'),wrapAsync(controllerListing.createListing)
);
router.get("/new", isLoggedIn, controllerListing.renderNewForm);


router.route("/:id")
.get(
  wrapAsync(controllerListing.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  wrapAsync(controllerListing.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(controllerListing.destroyListing)
);

// create route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(controllerListing.renderEditForm)
);

module.exports = router;
