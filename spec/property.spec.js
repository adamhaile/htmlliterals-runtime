describe("Html::property", function () {
    it("sets the given property", function () {
        var html = new Html("<input></input>");

        // static property value
        html.property(function (__) { __.type = "radio"; });

        expect(html.node.type).toBe("radio");
    });
})
