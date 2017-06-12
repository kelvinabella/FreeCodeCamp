$(document).ready(function () {

    var operators = ['%', '÷', 'x', '-', '+', '='];
    var value = '';
    var lastval = '';
    var decimal = '';
    var decimal2 = '';
    var reset = false;
    var output = 0;

    function calculate(elementval) {

        if (($("#secondary").html().slice(-1) === elementval && operators.indexOf(elementval) !== -1) || ((operators.indexOf($("#secondary").html().slice(-1)) !== -1) && (operators.indexOf(elementval.slice(-1)) !== -1))) {
            //do nothing
        } else {

            if (elementval === "=" && value !== "0.") {

                reset = true;
                var calc = eval(value.replace(/x/g, "*").replace(/÷/g, "/"));
                if (!isNaN(calc) && calc.toString().indexOf('.') != -1) {
                    $("#main").html(calc.toFixed(5));
                } else {
                    $("#main").html(calc);
                }
                //get output for reference to new calculations
                output = eval(value.replace(/x/g, "*"));

            } else if (operators.indexOf(elementval) !== -1 && value === "0.") {
                //do nothing
						} else if (elementval === "0" && value === "0") {
								//do nothing
            } else if (elementval === ".") {

                if ($("#main").html().lastIndexOf(".") > 0) {
                    //do nothing
                } else if ($("#main").html() === '0' && elementval === ".") {

                    value = '0' + elementval;
                    $("#secondary").html(value);
                    $("#main").html(value);

                } else if ($("#main").html() !== '0' && value.match(/[=÷+*x%-]/g)) {

                    var arr = $("#secondary").html().split('');

                    for (var i = arr.length; i >= 0; i--) {
                        if (operators.indexOf(arr[i]) !== -1) {
                            decimal = arr.slice(i + 1, arr.length).join('');
                            break;
                        }
                    }

                    if (decimal === '') {

                        decimal = '0';
                        value = value + '0';

                    }

                    value += elementval;
                    decimal += elementval;

                    $("#secondary").html(value);
                    $("#main").html(decimal);

                    decimal = '';

                } else {

                    value += elementval;

                    $("#secondary").html(value);
                    $("#main").html(value);

                }

            } else if (operators.indexOf(elementval) !== -1) {

                if (value.match(/[=÷+*x%-]/g) === null && $("#main").html() === '0') {} else {
                    value += elementval;

                    $("#secondary").html(value);
                    $("#main").html(elementval);

                }
            } else {

                value += elementval;

                if (value.search(/[=÷+*x%-]/g) > 0) {

                    decimal2 = '';
                    var arr = value.split('');

                    for (var i = arr.length; i >= 0; i--) {
                        if (operators.indexOf(arr[i]) !== -1) {
                            lastval = arr.slice(i + 1, arr.length).join('');
                            break;

                        }
                    }

                    decimal2 += lastval;

                    $("#main").html(decimal2);
                    $("#secondary").html(value);

                } else if (operators.indexOf(elementval) === -1) {

                    $("#secondary").html(value);
                    $("#main").html(value);

                }

            }
        }

    }

    $("button").on("click", function (e) {

        if ($("#main").html().length === 8) {
            $("#secondary").html("DIGIT OVERFLOW");
            $("#main").html("0");
            value = '';
            return;
        }

        if ($(this).html() == "AC") {
            $("#secondary").html("0");
            $("#main").html("0");
            value = '';
            output = 0;

        } else if ($(this).html() == "CE") {

            var arr = $("#secondary").html().split('');

            if ($("#secondary").html() === "DIGIT OVERFLOW") {
                $("#secondary").html("0");
            }

            if (operators.indexOf(arr[arr.length - 1]) !== -1) {
                value = arr.slice(0, arr.length - 1).join('');
                $("#secondary").html(value);

            } else if (value.match(/[=÷+*x%-]/g) === null) {
                $("#secondary").html("0");
                value = '';
            } else {
                for (var i = arr.length; i >= 0; i--) {
                    if (operators.indexOf(arr[i]) !== -1) {
                        value = arr.slice(0, i + 1).join('');
                        $("#secondary").html(value);
                        break;
                    }
                }

            }

            arr = [];

            $("#main").html("0");

        } else {
            if (reset) {
                if (operators.indexOf($(this).html()) > -1) {

                    if ($(this).html() !== "=") {
                        value = output + $(this).html();
                        $("#secondary").html(value);

                    }
                } else {

                    value = '';
                    output = 0;

                    calculate($(this).html());
                }

                reset = false;

            } else {

                calculate($(this).html());
            }
        }
    });



});