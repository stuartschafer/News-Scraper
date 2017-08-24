
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
//  For scraping
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");

var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

mongoose.Promise = Promise;

var app = express();

// For express and handling data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

var PORT = process.env.PORT || 8080;

// For the static directory
app.use(express.static("public"));

// To connect with my mongoose db
// mongoose.connect("mongodb://localhost/newsscrape");
mongoose.connect("mongodb://heroku_5k1cfsnp:miql9ut9f31gob5986c2hvqsfg@ds141082.mlab.com:41082/heroku_5k1cfsnp");

var db = mongoose.connection;

// For handlebars, to define the main layout
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If there are any errors connecting to the db
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// For a successful connection
db.once("open", function() {
  console.log("Successfully connected to the Mongoose database!");
});

app.get("/", function(req, res) {
    res.render("index");
});

// This route will scrape the Onion's website
app.get("/scrape", function(req, res) {
    // Each time the user "scrapes", this will remove any article the user hasn't previously saved
    db.collection("articles").remove({"savedNews":false});

    request("http://www.theonion.com/", function(error, response, html) {
        var newArray = [];
        var entry = {};
        var $ = cheerio.load(html);

        $(".headline").each(function(i, element) {
            // This will only allow 10 results
            if (i >= 10) {
               return false;
            }
            var result = {};
            result.title = $(this).children("a").text();
            result.link = "http://www.theonion.com" + $(this).children("a").attr("href");
            result.savedNews = false;
            // result.pic = $(this).children(".thumb").text();
            
            entry = new Article(result);

            // For handlebars to recognize the id
            entry.newsId = entry._id;

            newArray.push(entry);

            entry.save(function(err, doc) {
                if (err) {
                    // console.log(err);
                    if (err.code === 11000) { 
                        console.log("Article has already been saved");
                    }
                }
            });
        });
        var news = {newsStuff: newArray}
        res.render("scraped", news);
    });
});

// This route will get all the saved articles from the db
app.get("/saved", function(req, res) {
    console.log("-------SAVED ROUTE-------");
    Article.find({"savedNews": true }, function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            if (doc.length === 0) {
                res.redirect("/articles");
            } else {
                var news = {newsStuff: doc}
                res.render("saved", news);
            }
        }
    })
});

// This route will get the last 10 scrapped articles from the db
app.get("/articles", function(req, res) {
    console.log("-------SCRAPED ROUTE-------");
    Article.find({"savedNews":false}, function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            if (doc.length === 0) {
                res.redirect("/");
            } else {
                var news = { newsStuff: doc}
                res.render("scraped", news);
            }
        }
    });
});

// This route selects a specific id and will save or delete the article,
// and will add a note if the user enters one
app.post("/articles/:id", function(req, res) {
    var savedNews = req.body.savedNews;

    if (savedNews === "true") {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "savedNews": true } )
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else { 
                    res.send(doc);
                }
            });
    } else if (savedNews === "false") {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "savedNews": false } )
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else { 
                    res.send(doc);
                }
            });
    } else {
        var newNote = new Note(req.body);
        
        newNote.save(function(error, doc) {
            if (error) {
            console.log(error);
            } else { 
                Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id }
                )
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else { 
                        res.send(doc);
                    }
                });
            }
        }); 
    }
});

// This route will show the note on a specific article
app.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("note")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.listen(PORT, function() {
  console.log("News Scraper is running on port 8080!");
});