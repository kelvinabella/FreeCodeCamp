$(document).ready(function() {

    var tweetvalue = "";

    function getPhoto(photo) {
        var textdata = '';
        textdata = photo.hits[Math.floor(Math.random() * 20)].webformatURL;
        $("body").css("background-image", "url(" + textdata + ")");
    }

    function getQuote(quote) {
        $("h3").text(quote.quoteText);
        if (quote.quoteAuthor === "") {
            $("h5").text("- " + "Unknown");
            tweetvalue = "https://twitter.com/intent/tweet?text=" + quote.quoteText + " - Unknown";
            $(".twitter-share-button").attr("href", tweetvalue);
        } else {
            $("h5").text("- " + quote.quoteAuthor);
            tweetvalue = "https://twitter.com/intent/tweet?text=" + quote.quoteText + " - " + quote.quoteAuthor;
            $(".twitter-share-button").attr("href", tweetvalue);
        }

        $("h5,h3,#twitter,#newquote").css("color", "#" + Math.floor(Math.random() * 16777215).toString(16));

        $.getJSON("https://pixabay.com/api/?key=4350095-0e9ff461c110027b57d53f19d&q=nature&image_type=photo", getPhoto);

    }

    $.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", getQuote);

    $("#newquote").click(function() {
        $.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", getQuote);

        $(".animate").fadeOut('slow', function() {
            $(".animate").fadeIn()
        });
    });

});
