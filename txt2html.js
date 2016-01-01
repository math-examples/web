function html2txt() {
    var txt = "";
    let list = null;
    list = document.querySelectorAll("p");
    if (!list) {
        return txt;
    }
    //const regex = /<[^>]*>/g; // tags
    const regex = /[\r\n]+/gm; // line breaks
    for (var i = 0; i < list.length; i++) {
        let x = list[i].innerHTML;
        txt += x.replace(regex, '');
        //txt += x;
        if (i + 1 < list.length) txt += "\n";
    }
    return txt;
}