    // highlight =[#AAFED4C6]
    const globalBgColors = [
        "204, 232, 207",
        "241, 229, 201",
        "250, 249, 222",
        "255, 242, 226",
        "253, 230, 224",
        "227, 237, 205",
        "220, 226, 241",
        "233, 235, 254",
        "234, 234, 239",
        "188, 193, 189",
        "110, 123, 108",
        "255, 255, 255"];

    var globalBgColorIndex = 0;

    function setBgColor(rgb) {
        var colour = 'rgb(' + rgb + ')';
        document.body.style.backgroundColor = colour;
        //contentClass
        //const es = document.querySelectorAll('p');
//es.forEach(e => { e.style.color = 'rgb(17, 17, 17)';});
    }

    function changeBgColor() {
        ++globalBgColorIndex;
        setBgColor(globalBgColors[globalBgColorIndex % globalBgColors.length]);
    }
