define('directives.attr', ['Html'], function (Html) {
    Html.addDirective('attr', function (node) {
        return function attr(name, value) {
            node.setAttribute(name, value);
        };
    });
});
