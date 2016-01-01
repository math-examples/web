function displayTime() {
    var today = new Date();
    var seconds = today.getSeconds();
    var minutes = today.getMinutes();
    var hours = today.getHours();
    var days = today.getDate();
    var months = today.getMonth() + 1;
    var years = today.getFullYear();
    var scom = checkTime(hours) + ":" + checkTime(minutes) + ":" + checkTime(seconds);
    var s = checkTime(years) + "/" + checkTime(months) + "/" + checkTime(days) + " " + scom;

    const ele = document.getElementById('displayTime');
    if (ele) ele.innerHTML = s;
    t = setTimeout('displayTime()', 500);
}

function checkTime(i) {
    if (i < 10) i = "0" + i;
    return i;
}

displayTime();
