const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const listings = require('./models/listing');
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