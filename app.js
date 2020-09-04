const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Schema
const articleSchema = {
    title: String,
    content: String
}

// Model
const Article = mongoose.model("Article", articleSchema);

// Chained route handlers for a specific article
app.route("/articles/:name")
.get((req, res) => {
    const articleName = req.params.name;

    Article.findOne({ title: articleName}, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log(err);
        }
    });
})
.put((req, res) => {
    const articleName = req.params.name;

    Article.update(
        {title: articleName},
        {title: req.body.title,
         content: req.body.content},
        {overwrite: true},
        err => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})
.patch((req, res) => {
    const articleName = req.params.name;

    Article.update(
        {title: articleName},
        {$set: req.body},
        err => {
            if (!err) {
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        }
    )
})
.delete((req, res) => {
    const articleName = req.params.name;
    
    Article.deleteOne({ title: articleName }, (err) => {
        if (!err) {
            res.send("Successfully deleted the article!");
        } else {
            res.send(err);
        }
    })
});

// Chained route handlers for "articles" route
app.route("/articles")
.get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            console.log(err);
        }
    })
})
.post((req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const article = new Article ({
        title: articleTitle,
        content: articleContent
    });

    // Sends back a response to the POST request
    article.save((err) => err ? res.send(err) : res.send("Article was successfully saved!"));
})
.delete((req, res) => {
    Article.deleteMany({}, err => err ? res.send(err) : res.send("All articles deleted!"));
});

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});

