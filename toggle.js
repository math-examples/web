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

function toggle(elementId1, elementId2, s1, s2, cb1, cb2) {
      const btn = document.getElementById("toggler");
      const element1 = document.querySelector(elementId1);
      const element2 = document.querySelector(elementId2);
      // alert(element2.style.display);
      if (element1.style.display === "none"
      || element1.style.display === "") {
          cb1();
        //alert("1");
        element2.style.display = "none";
        element1.style.display = "block";
        btn.innerHTML = s2;
      } else {
          cb2();
        //alert(element1.style.display);
        element1.style.display = "none";
        element2.style.display = "block";
        btn.innerHTML = s1;
      }
}
