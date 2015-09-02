describe("Html::insert", function () {
    var container = "<div>before<!-- insert -->after</div>";

    it("inserts nothing for null", function () {
        expect(insert(null).innerHTML)
        .toBe("before<!-- insert -->after");
    });

    it("can insert strings", function () {
        expect(insert("foo").innerHTML)
        .toBe("beforefoo<!-- insert -->after");
    });

    it("can insert a node", function () {
        expect(insert(new Html("<span>foo</span>").node).innerHTML)
        .toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can re-insert a node, thereby moving it", function () {
        var node = new Html("<span>foo</span>").node,
            first = insert(node),
            second = insert(node);

            expect(first.innerHTML)
            .toBe("before<!-- insert -->after");
            expect(second.innerHTML)
            .toBe("before<span>foo</span><!-- insert -->after");
    });

    it("can insert a fragment", function () {
        expect(insert(new Html("<span>foo</span>inside<span>bar</span>").node).innerHTML)
        .toBe("before<span>foo</span>inside<span>bar</span><!-- insert -->after");
    });

    it("can re-insert a fragment, thereby moving it", function () {
        var frag = new Html("<span>foo</span>inside<span>bar</span>").node,
            first = insert(frag),
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
        expect(insert([new Html("<span>foo</span>").node, new Html("<div>bar</div>").node]).innerHTML)
        .toBe("before<span>foo</span><div>bar</div><!-- insert -->after");
    });

    it("can (currently) insert nested arrays", function () {
        // should we support this?
        expect(insert(["foo", ["bar", "blech"]]).innerHTML)
        .toBe("beforefoo bar blech<!-- insert -->after", "array of array of strings");
    });

    function insert(val) {
        var html = new Html(container);

        html.child([1], function (__) {
            __[0].insert(function () { return val; });
        })

        return html.node;
    }
});
