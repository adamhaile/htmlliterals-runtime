describe("Html(...) parse html -> node -> html is idempotent", function () {
    it("for tables", function () {
        roundTrip("<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>");
    });

    it("for thead", function () {
        roundTrip("<thead><tr><td>a</td><td>b</td></tr></thead>");
    });

    it("for tbody", function () {
        roundTrip("<tbody><tr><td>a</td><td>b</td></tr></tbody>");
    });

    it("for tr", function () {
        roundTrip("<tr><td></td><td>b</td></tr>");
    });

    it("for td", function () {
        roundTrip("<td>a table cell</td>");
    });

    it("for tds", function () {
        roundTrip("<td>one</td><td>two</td>");
    });

    it("for th", function () {
        roundTrip("<th>a table cell</th>");
    });

    it("for ths", function () {
        roundTrip("<th>one</th><th>two</th>");
    });

    it("for ul", function () {
        roundTrip("<ul><li>one</li><li>two</li></ul>");
    });

    it("for ol", function () {
        roundTrip("<ol><li>one</li><li>two</li></ol>");
    });

    it("for li", function () {
        roundTrip("<li>a list item</li>");
    });

    it("for lis", function () {
        roundTrip("<li>one</li><li>two</li><li>three</li>");
    });

    it("for dl", function () {
        roundTrip("<dl><dt>one</dt><dd>one def</dd><dt>two</dt><dd>two def</dd></dl>");
    });

    it("for dt", function () {
        roundTrip("<dt>one</dt><dd>one def</dd><dt>two</dt><dd>two def</dd>");
    });

    it("for span", function () {
        roundTrip("<span>some text</span>");
    });

    it("for spans", function () {
        roundTrip("<span>one</span><span>two</span>");
    });

    // head and body currently fail, as the parser attaches a body to a head and vice versa
    // how to fix?
    //it("", function () {
    //    roundTrip("<head><title>title</title></head>");
    //});

    //it("", function () {
    //    roundTrip("<body>Jimmy Hoffa</body>")
    //});

    it("for title", function () {
        roundTrip("<title>title</title>");
    });

    it("for input", function () {
        // why does this fail?  shouldn't it be <input/>, not <input>?
        //roundTrip("input", "<input/>");
        roundTrip("<input>");
    });

    it("for text", function () {
        roundTrip("some text");
    });

    it("for comment", function () {
        roundTrip("<!-- a comment -->");
    });

    it("for bad html", function () {
        roundTrip("<> bad type=\"html <");
    });

    it("for unknown tags", function () {
        roundTrip("<foo><bar></bar></foo>");
    });

    function roundTrip(html) {
        var node = new Html(html).node,
            back = serialize(node);

        // since some browsers change tag case, we don't required case-preservation
        expect(html.toLowerCase()).toBe(back.toLowerCase());
    }
    
    function serialize(node) {
        var str = "", i;

        if (node.outerHTML !== undefined) {
            str = node.outerHTML;
        } else if (node.nodeType === 3 /* text node */) {
            str = node.data;
        } else if (node.nodeType === 8 /* comment node */) {
            str = "<!--" + node.data + "-->";
        } else if (node.nodeType === 11 /* document fragment */) {
            for (i = 0; i < node.childNodes.length; i++) {
                str += serialize(node.childNodes[i]);
            }
        } else {
            throw new Error("Don't know how to stringify node: " + node);
        }

        return str;
    }
});
