var express = require("express");
const bodyParser = require("body-parser");

var request = require("request");
const fetch = require("node-fetch");
var fs = require("fs");
var path = require("path");
const { parse } = require("path");
var imgJson;

//port to use (8875 - Testing // 8877 - Live website)
var port = 7788;

var app = express();
var handlebars = require("express-handlebars").create({
    defaultLayout: "main",
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", port);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-------------------HOME SECTION--------------------------------------------------------------//

//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/", async function (req, res) {
    var context = {};
    searchItem = "https://en.wikipedia.org/wiki/Peanut_butter";
    var testSearchItem = searchItem.includes("https://en.wikipedia.org/wiki/");
    var results;
    var spawn = require("child_process").spawn;

    var process = spawn("python", ["./wikipediaFerratPlus.py", searchItem]);
    process.stdout.on("data", function (data) {
        //console.log(data.toString());
        results = data.toString();
        // ---------------DO WHAT YOU WITH HERE:
        var parsedResults = JSON.stringify(results);
        context.links = JSON.parse(parsedResults);
    });
    setTimeout(function () {
        console.log(context.links);
        res.render("home", context);
    }, 500);
});

//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/test", async function (req, res) {
    var context = {};
    searchItem = "https://en.wikipedia.org/wiki/Peanut_butter";
    var testSearchItem = searchItem.includes("https://en.wikipedia.org/wiki/");
    var results;
    var spawn = require("child_process").spawn;
    if (testSearchItem == true) {
        var process = spawn("python", ["./wikipediaFerratPlus.py", searchItem]);
        process.stdout.on("data", function (data) {
            //console.log(data.toString());
            results = data.toString();
            setTimeout(function () {
                // ---------------DO WHAT YOU WITH HERE:
                var parsedResults = JSON.stringify(results);
                context.links = JSON.parse(parsedResults);
                res.render("home", context);
            }, 500);
        });
    } else {
        res.render("home", context);
    }
});

//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/results", function (req, res, next) {
    var context = {};
    res.render("results", context);
});

async function callWikipediaFerratPlus(searchItem) {
    var spawn = require("child_process").spawn;
    var process = spawn("python", ["./wikipediaFerratPlus.py", searchItem]);
    process.stdout.on("data", function (data) {
        //console.log(data.toString());
        return data.toString();
    });
}

/*






function imageAPI(search) {
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "query",
    format: "json",
    titles: "Albert Einstein",
    prop: "info",
    inprop: "url",
    generator: "links",
    pilimit: "1"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.pages;
        for (var p in pages) {
          console.log(pages[p].fullurl);
        }
    })
    .catch(function(error){console.log(error);});
}
*/

//-------------------SERVER SECTION--------------------------------------------------------------//
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log(
        "Express started on flip1.engr.oregonstate.edu:" +
            app.get("port") +
            " OR localhost:" +
            app.get("port") +
            "; press Ctrl-C to terminate."
    );
});
