const express = require("express");
const logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headlines";
mongoose.connect(MONGODB_URI);

//function to scrape NYT and get title, URL and description
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  var returnData = [];
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.nytimes.com/section/technology").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      var result = {};
      $("article").each(function(i, element) {
        result.title = $($(element).find("h2").children()[0]).text();
        result.url = "https://www.nytimes.com/" + $(element).find("a").attr("href");
        result.excerpt = $(element).find("p").text();
        result.favorite = false;
        db.Headline.create(result)
          .then(function(dbHeadline){
            returnData.push(result);
          })
          .catch(function(err){
            console.log(err);
          })
        });
      })
  // Send data
  //console.log(returnData);
  res.json(true)
})

//route to list all scraped headlines
// Route for getting all Articles from the db
app.get("/headlines", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Headline.find({})
    .then(function(dbHeadline){
      res.json(dbHeadline);
    })
    .catch(function(err){
      res.json(err);
    });
});

//route to save an article
app.post("/favorite/:id", function(req, res){
  db.Headline.findOneAndUpdate({ _id: req.params.id }, { favorite: true }, { new: true })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  res.status(200);
})

//route to list all saved articles
app.get("/headlines/saved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Headline.find({favorite: true})
    .then(function(dbHeadline){
      res.json(dbHeadline);
    })
    .catch(function(err){
      res.json(err);
    });
});

//route to add/edit a note on a saved article//////////////////////////////
app.post("/note/:id", function(req, res){
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Headline.updateOne({ _id: req.params.id }, {$push: {notes: dbNote._id}}, { new: true })
  })
  .then(function(dbHeadline){
    res.json(dbHeadline);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})

//route to find Headline and all notes saved under it
app.get("/headline/:id", function(req, res){
  db.Headline.findOne({_id: req.params.id})
  .populate("notes")
  .then(function(dbHeadline){
    res.json(dbHeadline)
  })
  .catch(function(err){
    res.json(err);
  })
})

//route to  delete a note/////////////////////////////////////////


//route to unsave a note
app.post("/favorite/remove/:id", function(req, res){
  console.log("Updating: " + req.params.id);
  db.Headline.findOneAndUpdate({ _id: req.params.id }, { favorite: false }, { new: true })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  res.status(200);
})

//catch all route
app.get("*", function(req, res){
  res.redirect("index");
})


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});