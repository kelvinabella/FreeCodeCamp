var accounts = ['freecodecamp', 'storbeck', 'terakilobyte', 'habathcx', 'RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'MedryBW', 'brunofin', 'comster404', 'quill18', 'ESL_SC2', 'OgamingSC2', 'cretetion'];
var streamsUrl = 'https://wind-bow.gomix.me/twitch-api/streams/';
var userUrl = 'https://wind-bow.gomix.me/twitch-api/users/';

function Users(userLogo, displayName, userStatus, streamData) {
    this.userLogo = userLogo;
    this.displayName = displayName;
    this.userStatus = userStatus;
    this.streamData = streamData;
}

function getUserDetails(user) {

    var userValue = new Users();
    var logoPng = 'https://s3-us-west-2.amazonaws.com/web-design-ext-production/p/Glitch_474x356.png';

    $.getJSON(userUrl + user + '?callback=?', function (data) {
        if (data.status !== 422) {
            if (data.logo === null) {
                userValue.userLogo = logoPng;
            } else {
                userValue.userLogo = data.logo;
            }
            userValue.displayName = data.display_name;
        } else {
            userValue.userLogo = logoPng;
            userValue.displayName = user;
            userValue.userStatus = 'Closed';
        }

        $.getJSON(streamsUrl + user + '?callback=?', function (data) {
            if (data.stream !== null && data.stream !== undefined) {
                userValue.userStatus = 'Online';
                userValue.streamData = data.stream.channel.status;
            } else {
                if (userValue.userStatus !== 'Closed') {
                    userValue.userStatus = 'Offline';
                }
                userValue.streamData = '';
            }
            renderData(userValue.userLogo, userValue.displayName, userValue.userStatus, userValue.streamData);
        });
    });

}

function renderData(logo, displayName, userStatus, streamData) {

    var status = '';
    var data1 = '<li class = "' + displayName.toLowerCase() + ' user ';
    var data2 = '"><a href ="https://www.twitch.tv/' + displayName + '" target = "_blank">' + '<img class="logo" src="' + logo + '"alt="logo" align = "middle"><br><div id = "user-details"><span class = "disp-name">' + displayName + '</span><p class = "stream-data">' + streamData + '</p></div>' + '</a></li>';

    if (userStatus === 'Closed') {
        status = 'closed';
    } else if (userStatus === 'Online') {
        $('#list1').append(data1 + 'online' + data2);
        status = 'online';

    } else if (userStatus === 'Offline') {
        $('#list2').append(data1 + 'offline' + data2);
        status = 'offline';
    }

    $('#list').append(data1 + status + data2);
    $('.offline').css('background-color', '#FFFF33');
    $('.closed').css('background-color', '#D3D3D3');
    $('.online').css('background-color', '#7CFC00');
}

function handleSearch() {

    if (document.getElementById('search').value.length > 0) {
        var arr = accounts.filter(function (data) {
            return data.toLowerCase().includes(document.getElementById('search').value.toLowerCase());
        });
        $('.user').css('display', 'none');

        for (var i in arr) {
            console.log(arr[i].toLowerCase());
            $('.' + arr[i].toLowerCase()).css('display', 'inline-block');
        }
    } else {
        $('.user').css('display', 'inline-block');
    }
}

$(document).ready(function () {

    for (var i in accounts) {
        getUserDetails(accounts[i]);
    }

    $('#search').keyup(function (event) {
        handleSearch();
    });

    $('#submit').submit(function (event) {
        handleSearch();
        event.preventDefault();
    });

    var submitIcon = $('.searchbox-icon');
    var inputBox = $('.searchbox-input');
    var searchBox = $('.searchbox');
    var isOpen = false;
    submitIcon.click(function () {
        if (isOpen == false) {
            searchBox.addClass('searchbox-open');
            inputBox.focus();
            isOpen = true;
        } else {
            searchBox.removeClass('searchbox-open');
            inputBox.focusout();
            isOpen = false;
        }
    });
    submitIcon.mouseup(function () {
        return false;
    });
    searchBox.mouseup(function () {
        return false;
    });
    $(document).mouseup(function () {
        if (isOpen == true) {
            $('.searchbox-icon').css('display', 'block');
            submitIcon.click();
        }
    });


});