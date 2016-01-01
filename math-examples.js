var debugInfoGlobal = "";

function getDebugInfo() {
    return debugInfoGlobal;
}

function addDebugInfo(info) {
    return debugInfoGlobal += info + "<br>";
}

function clearDebugInfo(info) {
    return debugInfoGlobal = "";
}

function checkEventOrder() {
    window.addEventListener("load", (event) => {
        addDebugInfo("window load");
    });

    document.addEventListener("readystatechange", (event) => {
        addDebugInfo(`document readystatechange: ${document.readyState}`);
    });

    document.addEventListener("DOMContentLoaded", (event) => {
        addDebugInfo(`document DOMContentLoaded`);
    });
}

checkEventOrder();

function appendJsCss(element) {
    document.getElementsByTagName('head').item(0).appendChild(element);
    element.addEventListener("load", (event) => {
        if (element.hasAttribute("src")) {// js
            addDebugInfo(`Loaded ${element.src}`);
        } else {// css
            addDebugInfo(`Loaded ${element.href}`);
        }
    }, false);
}

function includeDefer(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
    script.async = false;
    appendJsCss(script);
}

function include(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = false;
    script.async = false;
    appendJsCss(script);
}

function includeAsync(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = false;
    script.async = true;
    appendJsCss(script);
}

function loadJsCssFile(path, type) {
    if (type == "js") {
        var fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", path);
    } else if (type == "css") {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", path);
    }
    appendJsCss(fileref);
}

// Stylesheets
loadJsCssFile("https://math-examples.github.io/web/math-examples.css", "css");
/* Include Many js files */
includeDefer('https://math-examples.github.io/web/displayTime.js');
//include('https://math-examples.github.io/web/requestUserRepoContent.js');
include('https://math-examples.github.io/web/txt2html.js');
//include('https://math-examples.github.io/web/iframe.js');
includeAsync('https://math-examples.github.io/web/resizeText.js');
includeAsync('https://math-examples.github.io/web/changeBgColor.js');
includeAsync('https://math-examples.github.io/web/showLog.js');
//includeAsync('https://math-examples.github.io/web/file.js');
includeAsync('https://math-examples.github.io/web/toggle.js');
includeAsync('https://math-examples.github.io/web/tts.js');


//######## file.js ###########
function saveAs(content, fileName) {

    const anchor = document.createElement("a");

    const isBlob = content.toString().indexOf("Blob") > -1;

    let url = content;

    if (isBlob) {

        url = window.URL.createObjectURL(content);

    }

    anchor.href = url;

    anchor.download = fileName;

    anchor.click();

    if (isBlob) {

        window.URL.revokeObjectURL(url);

    }

    //document.removeChild(anchor);

}

function saveTxt(txt, name) {
    var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
    saveAs(blob, name);
}

//######## txt2html.js ###########
function txt2html(txt) {
    const data = txt.split(/\r?\n/).filter(element => element);

    let div = document.getElementById('txt2html');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }


    let length = data.length;

    for (let j = 1; j <= length; ++j) {

        let i = j - 1;
        let p = document.createElement('p');
        p.setAttribute('class', 'contentClass');
        var name = data[i];
        p.innerHTML = (`${name}`);

        /*   li.innerHTML = (`

               <p>${name}</p>

           `); */
        div.appendChild(p);
    }
}

function txt2htmlClickable(txt, prefix, reverse, parId) {
    const data = txt.split(/\r?\n/).filter(element => element);
    //alert(data.length);
    let ol = document.getElementById(parId);
    let length = data.length;
    for (let j = 1; j <= length; ++j) {
        let i = j - 1;
        if (reverse) i = length - j;
        let li = document.createElement('li');
        var name = data[i];
        // alert(name);
        let link = "";
        link = prefix + '/' + name;
        if (name.charAt(0) == '\(') {
            let ii = name.indexOf('\)');
            if (ii + 1 < name.length) name = name.substr(ii + 1);
        }
        var ilast = name.lastIndexOf('.');
        if (ilast > 0) name = name.substring(0, ilast);
        // Create the html markup for each li
        // class used by others
        li.innerHTML = (`<a class="requestUserRepoContent" href="${link}">${name}</a>`);
        ol.appendChild(li);
    }
}

//######## receive-href-txt.js ###########

async function downloadFile(href) {
    if (!href) {
        return "无内容";
    }
    let response = await fetch(href);

    if (response.status != 200) {
        throw new Error("Server Error");
    }

    // read response stream as text
    let text_data = await response.text();

    return text_data;
}

//######## iframe.js ###########
const globalHasIframe = 1;
const trustedOrigins = ["https://math-examples.github.io"];

function runCode(x) {
    if (x.startsWith("scode=")) {
        const code = x.substring(6);
        const f = new Function(code);
        try {
            f();
        } catch (e) {
            showLog(e.message);
        }
    } else if (x.startsWith("code=")) {
        const iframe = document.querySelector("iframe");
        if (iframe) iframe.contentWindow.postMessage(x, '*');
    }
}

function replaceWebHref() {
    //var x = document.getElementsByClassName("requestUserRepoContent");
    var x = document.querySelectorAll("a");

    for (var i = 0; i < x.length; i++) {
        if (!x[i].hasAttribute("href")) continue;
        x[i].href = "https://math-examples.github.io/web/receive-href-web.html" + "?href=" + x[i].href;
        //alert(x[i].href);
    }
    //alert(x.length);
}

function tellIframe(code) {
    if (window.self !== window.top) {
        //alert("not top window");
        return;
    }
    const iframe = document.querySelector("iframe");
    if (!iframe) return;
    //const code = "resizeText(1)";
    iframe.contentWindow.postMessage(code, '*');
}

function onMsgIframe(event) {
    if (!trustedOrigins.includes(event.origin)) return;
    if (event.data.startsWith("code=")) {
        const code = event.data.substring(5);
        const f = new Function(code);
        try {
            f();
        } catch (e) {
            showLog(e.message);
        }


    } else {
        alert(`Message from main window: ${event.data} from ${event.origin}`);
    }

    //event.source.postMessage('succeeded', event.origin);
}

function initIframe() {

    if (window.self === window.top) return;

    window.addEventListener("message", onMsgIframe, false);

    document.addEventListener("readystatechange", (event) => {
        if (event.target.readyState === "interactive") {
            replaceWebHref();
            //initLoader();
        } else if (event.target.readyState === "complete") {
            //initApp();
        }
    });
}

initIframe();

//######## x.js ###########
