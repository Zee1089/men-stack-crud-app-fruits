const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new



const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
// Import the Fruit model
const Fruit = require("./models/fruit.js");

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new



// GET /template to render on the page> LANDING PAGE?
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });
// server.js
// GET /fruits

app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    res.render("fruits/index.ejs", { fruits: allFruits });
  });
    
// GET /fruits/new/ to get the FORM
app.get("/fruits/new", (req, res) => {
    res.render('fruits/new.ejs');
  });

app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
});



// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits"); // redirect to index fruits
});

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
  });
  
app.get("/fruits/:fruitId/edit", async (req, res) => {
const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// server.js

app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });
  
  

  
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
// If at any point, you feel your terminal is getting crowded with additional information you don’t need, simply comment out 
// app.use(morgan('dev'));

