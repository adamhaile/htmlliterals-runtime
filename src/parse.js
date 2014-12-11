define('parse', [], function () {
    var matchOpenTag = /<(\w+)/,
        containerElements = {
            "li": "ul",
            "td": "tr",
            "th": "tr",
            "tr": "tbody",
            "thead": "table",
            "tbody": "table",
            "dd": "dl",
            "dt": "dl",
            "head": "html",
            "body": "html"
        };

    return function parse(html) {
        var container = document.createElement(containerElement(html)),
            len,
            frag;

        container.innerHTML = html;
        len = container.childNodes.length;

        if (len === 0) {
            // special case: empty text node gets swallowed, so create it directly
            if (html === "") return document.createTextNode("");
            throw new Error("HTML parse failed for: " + html);
        } else if (len === 1) {
            return container.childNodes[0];
        } else {
            frag = document.createDocumentFragment();

            while(container.childNodes.length !== 0) {
                frag.appendChild(container.childNodes[0]);
            }

            return frag;
        }
    }

    function containerElement(html) {
        var m = matchOpenTag.exec(html);
        return m && containerElements[m[1].toLowerCase()] || "div";
    }
});
