function displayTime()
{
var today=new Date();
var h=today.getHours();
var m=today.getMinutes();
var s=today.getSeconds();
// add a zero in front of numbers<10
m=checkTime(m);
s=checkTime(s);
const ele = document.getElementById('displayTime');
if(ele)ele.innerHTML=h+":"+m+":"+s;
t=setTimeout('displayTime()',500);
}

function checkTime(i){
if (i<10){
i="0" + i;
}
return i;
}

displayTime();