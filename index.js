
var goButton = document.getElementById("goButton");
var numberOfResults = document.getElementById("ideaSize");
var wikiURL = document.getElementById("wikiURL");

function goButtonClick() {
    var numberOfResultsValue = numberOfResults.value;
    var wikiURLValue = wikiURL.value;

    //error flags
    wikiFlag = true
    ideasFlag = true;

    //check number of ideas entered correctly
    if (numberOfResultsValue <= 0) {
        document.getElementById("ideaSizeError").textContent = "Please enter a positive number"
        ideasFlag = true;
        event.preventDefault();
    }
    else if (numberOfResultsValue == '') {
        document.getElementById("ideaSizeError").textContent = "Please enter a number"
        ideasFlag = true;
        event.preventDefault();
    }
    else {
        document.getElementById("ideaSizeError").style.visibility = "hidden";
        ideasFlag = false;
        event.preventDefault();
    }

    //check wiki URL validity
    if (wikiURLValue == '' || wikiURLValue.includes('wikipedia.org') == false) {
        document.getElementById("wikiURLerror").textContent = "Please enter a wikipedia URL"
        wikiFlag = true
        event.preventDefault();
    }
    else {
        document.getElementById("wikiURLerror").style.visibility = "hidden";
        wikiFlag = false
        event.preventDefault();
    }
    event.preventDefault();

    //make sure no error flags set, if good continue on. (else do nothing)
    if (ideasFlag == false && wikiFlag == false) {
        var url = "./results.html";
        window.location.replace(url);
        console.log("Go button clicked")
    }
    event.preventDefault();
}



document.addEventListener("DOMContentLoaded", function () {
    goButton.addEventListener("click", goButtonClick);
});