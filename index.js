
var goButton = document.getElementById("goButton");

function goButtonClick() {
    var numberOfResults = document.getElementById("ideaSize").value;
    var wikiURL = document.getElementById("wikiURL").value;

    //error flags
    wikiFlag = true
    ideasFlag = true;

    //check number of ideas entered correctly
    if (numberOfResults <= 0) {
        document.getElementById("ideaSizeError").textContent = "Please enter a positive number"
        ideasFlag = true;
    }
    else if (numberOfResults == '') {
        document.getElementById("ideaSizeError").textContent = "Please enter a number"
        ideasFlag = true;
    }
    else {
        document.getElementById("ideaSizeError").style.visibility = "hidden";
        ideasFlag = false;
    }

    //check wiki URL 
    if (wikiURL == '') {
        document.getElementById("wikiURLerror").textContent = "Please enter a wikipedia URL"
        wikiFlag = true
    }
    else {
        document.getElementById("wikiURLerror").style.visibility = "hidden";
        wikiFlag = false
    }

    //make sure no error flags set, if good continue on. (else do nothing)
    if (ideasFlag == false && wikiFlag == false) {
        var url = "./results.html";
        window.location.replace(url);
        console.log("Go button clicked")
    }
}
document.addEventListener("DOMContentLoaded", function () {
    goButton.addEventListener("click", goButtonClick);
});