const express=require("express");
const app=express();
const mongoose=require("mongoose")
const ejs=require("ejs");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

async function main(){

  await  mongoose.connect('mongodb://127.0.0.1:27017/travelhub');
}
main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err)
})
app.get("/",(req,res)=>{
    res.send("Hi, i am root");
})

app.get("/listings",async (req,res)=>{
    const alllisting= await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
})

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",async (req,res)=>{
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})



app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});    
})
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
})
// app.get("/testListing",async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"my villa",
//         description:"By the sea",
//         price:1200,
//         location:"Goa",
//         country:"India"

//     });
//     await samplelisting.save();
//     console.log("successfully saved");
//     res.send("saved");
// })

app.listen(8080,()=>{
    console.log("connected");
})