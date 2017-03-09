describe("Html::insert", function () { 
    // <div>before<!-- insert -->after</div>
    var container = document.createElement("div");
    container.appendChild(document.createTextNode("before"));
    container.appendChild(document.createComment(" insert "));
    container.appendChild(document.createTextNode("after"));

    it("inserts nothing for null", function () {
        expect(insert(null).innerHTML)
        .toBe("before<!-- insert -->after");
    });

    it("can insert strings", function () {
        expect(insert("foo").innerHTML)
        .toBe("beforefoo<!-- insert -->after");
    });

    it("can insert a node", function () {
        var node = document.createElement("span");
        node.innerText = "foo";
        expect(insert(node).innerHTML)
        .toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can re-insert a node, thereby moving it", function () {
        var node = document.createElement("span");
        node.innerText = "foo";

        var first = insert(node),
            second = insert(node);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can insert a fragment", function () {
        // <span>foo</span>inside<span>bar</span>
        var frag = document.createDocumentFragment();
        var span1 = document.createElement("span");
        span1.innerText = "foo";
        frag.appendChild(span1);
        frag.appendChild(document.createTextNode("inside"));
        var span2 = document.createElement("span");
        span2.innerText = "bar";
        frag.appendChild(span2);
        frag.originalNodes = Array.prototype.slice.apply(frag.childNodes);

        expect(insert(frag).innerHTML)
        .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can re-insert a fragment, thereby moving it", function () {
        // <span>foo</span>inside<span>bar</span>
        var frag = document.createDocumentFragment();
        var span1 = document.createElement("span");
        span1.innerText = "foo";
        frag.appendChild(span1);
        frag.appendChild(document.createTextNode("inside"));
        var span2 = document.createElement("span");
        span2.innerText = "bar";
        frag.appendChild(span2);
        frag.originalNodes = Array.prototype.slice.apply(frag.childNodes);

        var first = insert(frag),
            second = insert(frag);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can insert an array of strings, which will be separated by spaces", function () {
        expect(insert(["foo", "bar"]).innerHTML)
        .toBe( "beforefoo bar<!-- insert -->after", "array of strings");
    });

    it("can insert an array of nodes", function () {
        var nodes = [ document.createElement("span"), document.createElement("div")];
        nodes[0].innerText = "foo";
        nodes[1].innerText = "bar";
        expect(insert(nodes).innerHTML)
        .toBe("before<span>foo</span><div>bar</div><!-- insert -->after");
    });

    it("can (currently) insert nested arrays", function () {
        // should we support this?
        expect(insert(["foo", ["bar", "blech"]]).innerHTML)
        .toBe("beforefoo bar blech<!-- insert -->after", "array of array of strings");
    });

    function insert(val) {
        var html = container.cloneNode(true);

        Html.insert(html.childNodes[1], val, undefined);

        return html;
    }
});
