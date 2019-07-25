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


mongoose.connect("mongodb://localhost/headlines", { useNewUrlParser: true });


//function to scrape NYT and get title, URL and description
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://www.nytimes.com/section/technology").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        var result = {};
        $("article").each(function(i, element) {
          result.title = $($(element).find("h2").children()[0]).text();
          result.url = "https://www.nytimes.com/section/technology" + $(element).find("a").attr("href");
          result.excerpt = $(element).find("p").text();
         
          db.Headline.create(result)
            .then(function(dbHeadline){
              console.log(dbHeadline);
            })
            .catch(function(err){
              console.log(err);
            })
          });
        });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

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


//route to list all saved articles


//route to save a note on a saved article


//route to edit a note


//route to  delete a note


//route to unsave a note


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});