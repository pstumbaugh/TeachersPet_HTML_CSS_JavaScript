function testButtonClick() {
    imageAPI("Peanut_butter");
}
var testButton = document.getElementById("testButton");

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
    console.log("TEST");
    var url = "./index.html";
    window.location.replace(url);
    console.log("Go button clicked");
}

function imageAPI(search) {
    var table = document.getElementById("resultsLinksBox");
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        inprop: "url",
        action: "query",
        format: "json",
        titles: "Albert Einstein",
        prop: "info",
        pllimit: "max",
        gpllimit: "30",
        generator: "links",
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

document.addEventListener("DOMContentLoaded", function () {
    startOverButton.addEventListener("click", startOverButtonClick);
    testButton.addEventListener("click", testButtonClick);
});
