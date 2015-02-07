define('directives.focus', ['Html'], function (Html) {
    Html.addDirective('focus', function focus(node) {
        return function focus(flag) {
            flag ? node.focus() : node.blur();
        };
    });
});
