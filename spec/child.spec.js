describe("Html::child", function () {
    it("navigates to specified child", function () {
        var html = new Html(
            "<div>\
                <span></span>\
                <a></a>\
                <!-- comment --> \
            </div>"
        );

        expect(html.node.nodeName).toBe("DIV");

        // childNode navigation
        html.child([0, 1, 3, 5], function (__) {
            expect(__[0].node.nodeName).toBe("#text");
            expect(__[1].node.nodeName).toBe("SPAN");
            expect(__[2].node.nodeName).toBe("A");
            expect(__[3].node.nodeName).toBe("#comment");
        });
    });
})
