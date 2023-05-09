// 文字

var globalSynth = null;

var globalVoiceSelect = null;
var pitch = null;
var pitchValue = null;
var rate = null;
var rateValue = null;

let globalVoices = [];

function showTtsSetting(){
    var x = document.querySelector("#ttsSetting");
    if(x)x.style.display = "block";
    //if(x)x.remove();
}

function populateVoiceList() {
   //showLog("into populateVoiceList");
  // retrieve information about the synthesis voices available on the device
  globalVoices = globalSynth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });
  const selectedIndex =
    globalVoiceSelect.selectedIndex < 0 ? 0 : globalVoiceSelect.selectedIndex;
  globalVoiceSelect.innerHTML = "";
    //if(globalVoices.length==0){showLog("没有找到声音数据");hideTtsSetting();return;}
  for (let i = 0; i < globalVoices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${globalVoices[i].name} (${globalVoices[i].lang})`;

    if (globalVoices[i].default) {
      option.textContent += " -- 默认";
    }

    option.setAttribute("data-lang", globalVoices[i].lang);
    option.setAttribute("data-name", globalVoices[i].name);
    globalVoiceSelect.appendChild(option);
  }
  globalVoiceSelect.selectedIndex = selectedIndex;
  
  ispeak(); 
}

function initSpeak(){
if(window.self !== window.top){ return;}
const btnSpeak = document.querySelector("#speak");
if(!btnSpeak){
    showLog("没有启用朗读功能");
    return;
}
globalVoiceSelect = document.querySelector("select");
pitch = document.querySelector("#pitch");
pitchValue = document.querySelector(".pitch-value");
rate = document.querySelector("#rate");
rateValue = document.querySelector(".rate-value");

if ('speechSynthesis' in window){
    globalSynth = window.speechSynthesis;
    //showLog("找到浏览器语音合成接口!");
    showTtsSetting();
}else{
    showLog("没有找到浏览器语音合成接口!");
    //hideTtsSetting();
    return;
}

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

globalVoiceSelect.onchange = function () {
    showLog(`如果声音切换不起作用，请到手机设置中切换。`);
  //speak();
};

// This is because Firefox doesn't support the voiceschanged event, and will just return a list of voices when SpeechSynthesis.getVoices() is fired. With Chrome, however, you have to wait for the event to fire before populating the list, hence the if statement seen below.
if (globalSynth.onvoiceschanged !== undefined) {
  globalSynth.onvoiceschanged = populateVoiceList;
  globalSynth.getVoices();
}else{
    populateVoiceList();
}

}

function isButtonSpeak(){
    let x = document.getElementById('speak');
    return x.innerHTML == "朗读🔊";
}

function showButtonSpeak(){
    let x = document.getElementById('speak');
    x.innerHTML = "朗读🔊";
}

function showButtonStop(){
    let x = document.getElementById('speak');
    x.innerHTML = "停止❌️";
}

function speakText(txt) {
  if (globalSynth.speaking) {
    showLog("正在播放");
    return;
  }
  if (txt=="") {
    return;
  }
    const utterThis = new SpeechSynthesisUtterance();
    utterThis.text = txt;
    utterThis.onend = function (event) {
      //showLog("本句结束");
      //utterThis.text = "Hello Elena!";
      //globalSynth.speak(utterThis);
    };

    utterThis.onerror = function (event) {
        showButtonSpeak();
      showLog("句子出错");
    };

    const selectedOption =
      globalVoiceSelect.selectedOptions[0].getAttribute("data-lang");

    for (let i = 0; i < globalVoices.length; i++) {
      if (globalVoices[i].lang === selectedOption) {
        utterThis.voice = globalVoices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    globalSynth.speak(utterThis);
}

function setBg(p){
    p.style.color = "red";
}

function clearBg(p){
    p.style.color = "initial";
}

let globalSpeakState = 0;
function speakNodeList() {
  if (globalSynth.speaking) {
    showLog("正在播放");
    return;
  }
  let list = null;
  list = document.querySelectorAll("p");
  if(!list || list.length==0){
      showLog("无内容！");
      return;
  }

    let i_list = 0;
    const utterThis = new SpeechSynthesisUtterance();
    
    utterThis.onend = function (event) {
      clearBg(list[i_list]);
      //showLog("本句结束");
        ++i_list;
      if(i_list>=list.length){
          showLog("播放完毕！");
          showButtonSpeak();
          return;
      }
      if(globalSpeakState!=1)return;
      utterThis.text = list[i_list].innerHTML;
      setBg(list[i_list]);
      globalSynth.speak(utterThis);
      showUtterance(utterThis.text);
    };

    utterThis.onerror = function (event) {
        showButtonSpeak();
      showLog("句子出错");
    };

    const selectedOption =
    globalVoiceSelect.selectedOptions[0].getAttribute("data-lang");

    //alert(selectedOption);
    for (let i = 0; i < globalVoices.length; i++) {
        //alert(globalVoices[i].name);
        //alert(globalVoices[i].lang);
      if (globalVoices[i].lang === selectedOption) {
        utterThis.voice = globalVoices[i];
        break;
      }
    }
    //return;
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    globalSpeakState = 1;
    
    utterThis.text = list[i_list].innerHTML;
    setBg(list[i_list]);
    globalSynth.speak(utterThis);
    showUtterance(utterThis.text);
}

function isWeChat(){
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
}

function ispeak() {
if(!globalSynth){
    if(isWeChat()){
       showLogLong(`<span class="warn">注意：</span>微信不支持，请在浏览器中打开本网页!<br>步骤1：点击右上角···按钮。<br>步骤2：下方选择在浏览器打开，最好选择火狐浏览器打开。`); 
    }else{
        warnLog("此浏览器不支持，请用火狐浏览器打开！"); 
    }
    return;
}
if(!globalVoices || globalVoices.length==0){
    warnLogLong("没有找到可用的语音，请先允许浏览器使用麦克风权限，再重试。<br>如果还有问题，您也可以向开发者反馈！");
    return;  
}
let x = document.getElementById('speak');
    //alert(globalSynth.paused);
    if(isButtonSpeak()){
        speakNodeList();
        showButtonStop();
    }else{
        globalSpeakState = 0;
        globalSynth.cancel();
        showLog("已停止播放！");
        showButtonSpeak();
    }
}

var hasInitSpeak = 0;
function speak() {
  if(hasInitSpeak){
     ispeak(); 
  }else{
     initSpeak();
     hasInitSpeak = 1;
  }
}

function pause(){
//[Chrome/Firefox on Android] Pausing and resuming does not work.
    if(!globalSynth)return;
    let x = document.getElementById('pause');
    //alert(globalSynth.paused);
    if(x.innerHTML == "继续💚"){
        globalSynth.resume();
        x.innerHTML = "暂停❤";
    }else{
        globalSynth.pause();
        x.innerHTML = "继续💚";
    }
}