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
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
async function initizeData() {
     await listings.deleteMany({});
     await listings.insertMany(initData.data);
};
initizeData();