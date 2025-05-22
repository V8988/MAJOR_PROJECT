const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data.js");
//Mongo DB Connection
main()
.then(()=>{console.log("Connection Success");})
.catch((err)=>{console.log(err)});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'682d5e85827aaddebdefb837'}));
    await Listing.insertMany(initdata.data);
    console.log("Data was Initialized");
}   
initDB();