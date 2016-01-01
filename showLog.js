globalLog = "";
globalLogSet = 0;

var globalTimeout = null;

function showLog_(txt, ms) {
    if (window.self !== window.top) {
        var txtNew = txt.replace(/<br>/g, "\n");
        alert(`iframe:\n${txtNew}`); // css restriction
        return;
    }
    let x = document.querySelector("h1");
    if (!x) x = document.querySelector("h2");
    if (!x) {
        alert(txt.replace(/<br>/g, "\n"));
        return;
    }
    if (!globalLogSet) {
        globalLogSet = 1;
        globalLog = x.innerHTML;
    }
    if (globalTimeout != null) {
        clearTimeout(globalTimeout);
        globalTimeout = null;
    }
    x.innerHTML = txt;
    if (ms != 0) globalTimeout = setTimeout(() => {
        x.innerHTML = globalLog;
        globalTimeout = null;
    }, ms);
}

function showLog(txt) {
    showLog_(txt, 3000);
}

function showLogLong(txt) {
    showLog_(txt, 20000);
}

function showUtterance(txt) {
    showLog_(txt, 0);
}

function warnLog(txt) {
    showLog(`<span class="warn">❗️注意：</span>` + txt);
}

function warnLogLong(txt) {
    showLogLong(`<span class="warn">❗️注意：</span>` + txt);
}