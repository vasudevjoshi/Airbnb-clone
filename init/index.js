if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '../.env' });
}
const mongoose = require('mongoose');
const initData = require('./data.js');
const listings  = require('../models/listing');

const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
    console.error("Error: ATLASDB_URL is not defined in the .env file");
    process.exit(1);
}

main()
.then(() => {
    console.log("connected to database");
})
.catch((err) => {
    console.error(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

async function initizeData() {
    await listings.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67b176b388193368118036ff" }));
    await listings.insertMany(initData.data);
}

initizeData();