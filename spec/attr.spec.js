describe("Html::attr", function () {
    it("sets the given attribute", function () {
        var html = new Html("<input></input>");

        // static property value
        html.attr(function (__) { __("type", "radio"); });

        expect(html.node.getAttribute("type")).toBe("radio");
    });
})
