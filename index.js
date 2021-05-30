var goButton = document.getElementById("goButton");
var numberOfResults = document.getElementById("ideaSize");
var wikiURL = document.getElementById("wikiURL");

function goButtonClick() {
    var numberOfResultsValue = numberOfResults.value;
    var wikiURLValue = wikiURL.value;

    //error flags
    wikiFlag = true;
    ideasFlag = true;

    //check number of ideas entered correctly
    if (numberOfResultsValue <= 0) {
        document.getElementById("ideaSizeError").textContent =
            "Please enter a positive number";
        ideasFlag = true;
        event.preventDefault();
    } else if (numberOfResultsValue == "") {
        document.getElementById("ideaSizeError").textContent =
            "Please enter a number";
        ideasFlag = true;
        event.preventDefault();
    } else {
        document.getElementById("ideaSizeError").style.visibility = "hidden";
        ideasFlag = false;
        event.preventDefault();
    }

    //check wiki URL validity
    if (wikiURLValue == "") {
        document.getElementById("wikiURLerror").textContent =
            "Please enter a keyword";
        wikiFlag = true;
        event.preventDefault();
    } else {
        document.getElementById("wikiURLerror").style.visibility = "hidden";
        wikiFlag = false;
        event.preventDefault();
    }
    event.preventDefault();

    //make sure no error flags set, if good continue on. (else do nothing)
    if (ideasFlag == false && wikiFlag == false) {
        fadeItemOut("main");
        console.log("Go button clicked");
        linksAPI(wikiURLValue, numberOfResultsValue);
        //imageAPI(wikiURLValue);

        //wait for main page to fade out
        var delayInMilliseconds1 = 1000;
        setTimeout(function () {
            fadeItemIn("results");
        }, delayInMilliseconds1);
    }
    event.preventDefault();
}

function enterKeyCheck(ID) {
    //if user wants to hit the enter key while on the amount input field to submit:
    var wikiButtonClick = document.getElementById(ID);
    wikiButtonClick.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            // Number 13 is the "Enter" key on the keyboard
            goButtonClick();
            event.preventDefault();
        }
    });
}

//-------------------RESULTS FUNCTIONS------------------------

getResultsTitle(); //run the function when page loads
function getResultsTitle() {
    var resultsLinksTitle = [
        "WOW! Now those are some neat results:",
        "Ooooh, links!",
        "Your students will love these topics:",
        "Enjoy these fabulous results!",
        "You get a link, and you get link! Everone gets a link!",
    ];
    var resultsLinksVar = document.getElementById("resultsLinksTitle");

    resultsLinksVar.textContent =
        resultsLinksTitle[Math.floor(Math.random() * resultsLinksTitle.length)];
}

getWordsTitle(); //run the function when page loads
function getWordsTitle() {
    var resultsLinksTitle = [
        "So ... many ... words!",
        "Enjoy this curated list of words!",
        "So many words, so little time...",
        "Word: a single distinct meaninful element.",
        "Those are some popular words!",
    ];
    var resultsLinksVar = document.getElementById("resultsWordsTitle");

    resultsLinksVar.textContent =
        resultsLinksTitle[Math.floor(Math.random() * resultsLinksTitle.length)];
}

var startOverButton = document.getElementById("startOverButton");

function startOverButtonClick() {
    fadeItemOut("results");
    var delayInMilliseconds1 = 1000;
    setTimeout(function () {
        fadeItemIn("main");
    }, delayInMilliseconds1);
    console.log("Start Over button clicked");
}

function linksAPI(search, ideaNumber) {
    var table = document.getElementById("resultsLinksBox");
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        inprop: "url",
        action: "query",
        format: "json",
        titles: search,
        prop: "info",
        pllimit: "max",
        gpllimit: ideaNumber,
        generator: "links",
        list: "random",
        plnamespace: "linkshere",
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var pages = response.query.pages;
            for (var p in pages) {
                var type = document.createElement("tr");
                type.appendChild(document.createTextNode(pages[p].fullurl));
                table.appendChild(type);
                console.log(pages[p].fullurl);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function linkshere(search, ideaNumber) {
    function linksAPI(search, ideaNumber) {
        var table = document.getElementById("resultsLinksBox");
        var url = "https://en.wikipedia.org/w/api.php";

        var params = {
            action: "query",
            titles: search,
            prop: "linkshere",
            format: "json",
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function (key) {
            url += "&" + key + "=" + params[key];
        });

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                var pages = response.query.pages;
                var pageID = Object.keys(pages);
                var links = pages[pageID].linkshere;
                console.log(links);
                for (var p in links) {
                    var type = document.createElement("tr");
                    type.appendChild(document.createTextNode(links[p].title));
                    table.appendChild(type);
                    //console.log(pages[p].linkshere);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

//fades an item in, changes opacity to 1 and sets the z-index to 0
function fadeItemIn(item) {
    document.getElementById(item).style.animation = "fadeIn 1.5s"; //fade  in
    document.getElementById(item).style.opacity = "1"; //keep displayed on
    document.getElementById(item).style.zIndex = "0"; //move z-index
    return;
}

//fades an item out, changes opacity to 0 and sets the z-index to -50
function fadeItemOut(item) {
    document.getElementById(item).style.animation = "fadeOut 1s"; //fade out
    document.getElementById(item).style.opacity = "0"; //keep out
    document.getElementById(item).style.zIndex = "-50"; //move z-index
}

document.addEventListener("DOMContentLoaded", function () {
    goButton.addEventListener("click", goButtonClick);
    wikiURL.addEventListener("keyup", enterKeyCheck("wikiURL"));
    numberOfResults.addEventListener("keyup", enterKeyCheck("ideaSize"));
    startOverButton.addEventListener("click", startOverButtonClick);
});
