define('directives.focus', ['directives'], function (directives) {
    directives.focus = function focus(node) {
        return function focus(flag) {
            flag ? node.focus() : node.blur();
        };
    };
});
