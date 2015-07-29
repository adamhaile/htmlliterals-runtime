describe("Html::class", function () {
    it("can toggle a class on or off based on a truthy value", function () {
        var html = new Html("<input></input>");

        html.class(function (__) { __("true", true); });
        html.class(function (__) { __("false", false); });
        html.class(function (__) { __("one", 1); });
        html.class(function (__) { __("zero", 0); });

        expect(html.node.classList.contains("true")).toBe(true);
        expect(html.node.classList.contains("false")).toBe(false);
        expect(html.node.classList.contains("one")).toBe(true);
        expect(html.node.classList.contains("zero")).toBe(false);
    });

    it("can toggle between two classes based on a truthy value", function () {
        var html = new Html("<input></input>");

        // on/off classes with static flag
        html.class(function (__) { __("blech", "unblech", true); });
        html.class(function (__) { __("garg", "ungarg", false); });

        expect(html.node.classList.contains("blech")).toBe(true);
        expect(html.node.classList.contains("unblech")).toBe(false);

        expect(html.node.classList.contains("garg")).toBe(false);
        expect(html.node.classList.contains("ungarg")).toBe(true);
    });
})
