const listings = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const { listingSchema } = require("../schema.js");
module.exports.index  = async (req, res) => {
    const allListings = await listings.find({});
    res.render("./listings/index.ejs", { allListings });
  };

module.exports.renderNewForm = async (req, res) => {
    res.render("./listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await listings
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings"); // Add return here
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
    let newlistings = req.body.listing;
    console.log(newlistings);
    const newlisting = new listings(newlistings);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename};
    await newlisting.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
  };

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    let originalImage =listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing , originalImage });
  };

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError("Invalid listing data", 400);
    }

    let { id } = req.params;
   
    const listing = await listings.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      listing.save();
    }
    
    req.flash("success", " Listings Updated!!");
    res.redirect(`/listings/${id}`);
  };
  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await listings.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
  };