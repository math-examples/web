function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

    function toggleFullscreen1() {
        //setBgColor(globalBgColors[globalBgColorIndex % globalBgColors.length]);
        openFullscreen();
        document.querySelector(".curContent").addEventListener("dblclick", myToggle);
        document.querySelector("h2").addEventListener("dblclick", myToggle);
        showLogLong("您已进入全屏阅读模式，快速点击屏幕文字区域两次可退出全屏");
    }

    function toggleFullscreen2() {
        //setBgColor("255, 255, 255");
        closeFullscreen();
        document.querySelector(".curContent").removeEventListener("dblclick", myToggle);
        document.querySelector("h2").removeEventListener("dblclick", myToggle);
        showLog("您已退出全屏阅读模式");
    }

function toggle(elementId1, elementId2, s1, s2, cb1, cb2) {
    const btn = document.getElementById("toggler");
    const element1 = document.querySelector(elementId1);
    const element2 = document.querySelector(elementId2);
    // alert(element2.style.display);
    if (btn.innerHTML === s1
        || (element1 && (element1.style.display === "none" || element1.style.display === ""))
       ) {
        cb1();
        //alert("1");
        if(element2)element2.style.display = "none";
        if(element1)element1.style.display = "block";
        btn.innerHTML = s2;
    } else {
        cb2();
        //alert(element1.style.display);
        if(element1)element1.style.display = "none";
        if(element2)element2.style.display = "block";
        btn.innerHTML = s1;
    }
}
