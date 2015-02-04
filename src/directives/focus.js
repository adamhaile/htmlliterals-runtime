define('directives.focus', ['Shell'], function (Shell) {
    Shell.addDirective('focus', function focus(node) {
        return function focus(flag) {
            flag ? node.focus() : node.blur();
        };
    });
});
