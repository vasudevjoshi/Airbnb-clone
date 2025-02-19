const mongoose = require('mongoose');
const initData = require('./data.js');
const listings  = require('../models/listing');

main()
.then(() => {
console.log("connected to database")})
.catch((err) => {
    console.error(err);
});
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}
async function initizeData() {
     await listings.deleteMany({});
     initData.data = initData.data.map((obj)=>({...obj,owner: "67b176b388193368118036ff",}));
     await listings.insertMany(initData.data);
};
initizeData();