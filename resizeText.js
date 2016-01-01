function resizeText_(multiplier, document) {
    if (0) {
        //const declaration = document.styleSheets[0].rules[0].style;
        //const oldValue = declaration.removeProperty("font-size");
    }
    try {
        if (document.body.style.fontSize == "") {
            document.body.style.fontSize = "1.0em";
        }
        document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
    } catch (e) {
        showLog(e.message);
    }
}

function resizeText(multiplier) {
    resizeText_(multiplier, document);
    const code = `code=resizeText(${multiplier})`;
    try {
        tellIframe(code);
    } catch (e) {
        showLog(e.message);
    }
}

function resizeText2(multiplier) {
    const output = document.querySelector('body');
    const style = window.getComputedStyle(output);

    let fontSize = style.fontSize;
    alert(fontSize);
    output.style.fontSize = (parseFloat(fontSize) + 3) + 'px';
//alert(output.style.fontSize);

// const viewport = window.visualViewport;
//let x = 5 * viewport.scale;
//output.style.fontSize = x;
// output.style.fontSize = viewport.scale*styles.fontSize;
// output.style.textAlign = center;


//let num = 1 * viewport.scale;
//result.innerHTML =num.toString() + '...' + styles.fontSize;
//result.innerHTML = '手势缩放比例：' + this.scale;

    var iframe = document.getElementById("oriWeb");
    if (iframe) {
        try {
            // ...but not to the document inside it
            let doc = iframe.contentWindow.document; // ERROR
            resizeText_(multiplier, doc);
        } catch (e) {
            showLog(e.message);
            //alert(e); // Security Error (another origin)
        }
    }
}
