

getResultsTitle(); //run the function when page loads
function getResultsTitle() {
    var resultsLinksTitle = ["WOW! Now those are some neat results:", "Ooooh, links!",
        "Your students will love these topics:", "Enjoy these fabulous results!", "You get a link, and you get link! Everone gets a link!"];
    var resultsLinksVar = document.getElementById('resultsLinksTitle');

    resultsLinksVar.textContent =
        resultsLinksTitle[Math.floor(Math.random() * resultsLinksTitle.length)];
}

getWordsTitle(); //run the function when page loads
function getWordsTitle() {
    var resultsLinksTitle = ["So ... many ... words!", "Enjoy this curated list of words!", "So many words, so little time...", "Word: a single distinct meaninful element.",
        "Those are some popular words!"];
    var resultsLinksVar = document.getElementById('resultsWordsTitle');

    resultsLinksVar.textContent =
        resultsLinksTitle[Math.floor(Math.random() * resultsLinksTitle.length)];
}