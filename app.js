const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
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
app.get('/listings', (req, res) => {
    res.send("all listings mentioned");
    console.log("working successfully");
});
app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});