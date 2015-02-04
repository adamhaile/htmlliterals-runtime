define('directives.class', ['Shell', 'domlib'], function (Shell, domlib) {
    Shell.addDirective('class', function (node) {
        if (node.className === undefined)
            throw new Error("@class can only be applied to an element that accepts class names. \n"
                + "Element ``" + node + "'' does not. Perhaps you applied it to the wrong node?");

        return function classDirective(on, off, flag) {
            if (arguments.length < 3) flag = off, off = null;

            var hasOn = domlib.classListContains(node, on),
                hasOff = off && domlib.classListContains(node, off);

            if (flag) {
                if (!hasOn) domlib.classListAdd(node, on);
                if (off && hasOff) domlib.classListRemove(node, off);
            } else {
                if (hasOn) domlib.classListRemove(node, on);
                if (off && !hasOff) domlib.classListAdd(node, off);
            }
        };
    });
});
