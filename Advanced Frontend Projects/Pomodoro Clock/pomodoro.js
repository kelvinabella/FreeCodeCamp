$(document).ready(function () {

    var breakvalue = 5;
    var sessionvalue = 25;
    var id = 0,
        setTime = 0,
        divider = 0,
        count = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        width = 0;
    var stopped = false;
    var breakclicked = false;
    var sessionclicked = false;
    var format = '';

    function clockinterval() {
        if (width >= 100) {
            clearInterval(id);
            divider = width = 0;

            setTime = $("#break-val").html() * 60;
            divider = 100 / setTime;

            id = setInterval(clockinterval, 1000);

            if ($("#bar").html() == "SESSION") {
                $("#bar").html("BREAK!");
                $("#bar").css("backgroundColor", "yellow").css("width", 0);
                count = 1;
            } else {
                $("#bar").html("SESSION");
                $("#bar").css("backgroundColor", "green").css("width", 0);
                count = 0;
            }
        } else {
            setTime--;

            if (setTime / 60 > 59) {
                hours = Math.floor((setTime / 60) / 60);
                minutes = Math.floor((((setTime / 60) / 60) % 1) * 60);
                seconds = Math.floor((((((setTime / 60) / 60) % 1) * 60) % 1) * 60);

            } else {
                minutes = Math.floor(setTime / 60);
                seconds = Math.floor(setTime % 60);

            }

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            format = (setTime / 60 > 59) ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;

            $("#time").html(format);

            width += divider;
            $("#bar").width(width + '%');

        }
    }

    function resetValues(id, button) {
        setTime = $(id).html() * 60;
        divider = 100 / setTime;
        width = 0;
        if (button == "break") {
            breakclicked = false;
        } else {
            sessionclicked = false;
        }
        stopped = false;
    }

    function setValues(id, value, count) {

        breakclicked = (id == "break-val") ? true : false;
        sessionclicked = (id == "session-val") ? true : false;

        $("#" + id).html(value);
        if (count == 1 && id == "break-val") {
            $("#time").html(value);
        }
        if (count == 0 && id == "session-val") {
            $("#time").html(value);
        }

    }

    setTime = $("#time").html() * 60;
    divider = 100 / setTime;

    $("#stop, #reset").prop("disabled", true).css("color", "gray");

    $("#start").click(function () {

        if (count == 1) {
            resetValues("#break-val", "break");
        } else if (count == 0) {
            resetValues("#session-val", "session");
        }

        if (!stopped && breakclicked) {
            resetValues("#session-val", "session");
        }

        id = setInterval(clockinterval, 1000);
        $("#stop, #reset").prop("disabled", false).css("color", "white");
        $("#start, #break-add, #break-minus, #session-add, #session-minus").prop("disabled", true).css("color", "gray");

    });

    $("#stop").click(function () {
        stopped = true;
        clearInterval(id);
        $("#start, #break-add, #break-minus, #session-add, #session-minus").prop("disabled", false).css("color", "white");
    });

    $("#reset").click(function () {

        clearInterval(id);

        setTime = $("#session-val").html() * 60;
        divider = 100 / setTime;

        width = 0;
        breakvalue = 5;
        sessionvalue = 25;
        $("#break-val").html("5");
        $("#session-val, #time").html("25");
        $("#bar").css("backgroundColor", "green").css("width", 0).html("SESSION");
        $("#start, #break-add, #break-minus, #session-add, #session-minus").prop("disabled", false).css("color", "white");

    });

    $("#break-add, #session-add, #break-minus, #session-minus").click(function () {
        var id = $(this).attr("id");

        switch (id) {
        case "break-add":
            breakvalue += 1;
            setValues("break-val", breakvalue, count);
            break;
        case "session-add":
            sessionvalue += 1;
            setValues("session-val", sessionvalue, count);
            break;
        case "break-minus":
            if (breakvalue > 1) {
                breakvalue -= 1;
                setValues("break-val", breakvalue, count);
            }
            break;
        case "session-minus":
            if (sessionvalue > 1) {
                sessionvalue -= 1;
                setValues("session-val", sessionvalue, count);
            }
            break;
        }
    });

});