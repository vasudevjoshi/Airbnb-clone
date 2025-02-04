const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const listings = require('./models/listing');
const ejsmate = require('ejs-mate');
const path = require('path');
app.use((express.urlencoded({extended: true})));
app.set('view engine', 'ejs');
app.set("views",(path.join(__dirname, 'views')));

app.engine('ejs', ejsmate);
const methodOverride = require('method-override');
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

app.get('/listings', async (req, res) => {
   const allListings = await listings.find({});
   res.render('./listings/index.ejs',{allListings});

});
app.get('/listings/new', async (req, res) => {
    
    res.render('./listings/new.ejs');
 
 });
 app.post('/listings', async (req, res) => {
    let newlistings = req.body.listing;
    const newlisting = new listings(newlistings);
    newlisting.save();
    res.redirect('/listings');
 });
 

app.get('/listings/:id', async (req, res) => {
    let {id } = req.params;
    const listing = await listings.findById(id);
    res.render('./listings/show.ejs',{listing});
 
 });
 app.get('/listings/:id/edit', async (req, res) => {
    let {id } = req.params;
    const listing = await listings.findById(id);
    res.render('./listings/edit.ejs',{listing});
 
 });

 app.put('/listings/:id', async (req, res) => {

    let {id} = req.params;
    const listing = await listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
 });
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