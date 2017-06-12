$(document).ready(function() {

    var callApi = function() {

        $.ajax({

            url: url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exlimit=max&exintro=1&explaintext=1&gsrlimit=10&gsrwhat=text&gsrprop=snippet&gsrsearch=" + document.getElementById('input-search').value,
            dataType: 'jsonp',
            type: 'POST',
            headers: {
                'Api-User-Agent': 'Example/1.0'
            },
            success: function(data) {
                $('#list').empty();
                $("#list").append("<ul></ul>");
                var arr = data.query.pages;
                //$("#list").append("</ul>");
                for (var data in arr) {
                    $("#list ul").append("<li><a href = 'https://en.wikipedia.org/wiki/" + arr[data].title + "' target = '_blank'><span>" + "<h3>" + arr[data].title + "</h3><p>" + arr[data].extract + "</p></span></a></li>");
                }
            }

        });

    }

    $(".enjoy-css-search").click(callApi);

    $("#input-search").keypress(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $(".enjoy-css-search").click();

        }
    });

});