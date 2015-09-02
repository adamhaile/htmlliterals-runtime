define('Html.class', ['Html'], function (Html) {
    Html.class = function classMixin(on, off, flag) {            
        if (arguments.length < 3) flag = off, off = null;
            
        return function classMixin(node, state) {
            if (node.className === undefined)
                throw new Error("@class can only be applied to an element that accepts class names. \n"
                    + "Element ``" + node + "'' does not. Perhaps you applied it to the wrong node?");
                    
            if (flag === state) return state;

            var hasOn = Html.domlib.classListContains(node, on),
                hasOff = off && Html.domlib.classListContains(node, off);

            if (flag) {
                if (!hasOn) Html.domlib.classListAdd(node, on);
                if (off && hasOff) Html.domlib.classListRemove(node, off);
            } else {
                if (hasOn) Html.domlib.classListRemove(node, on);
                if (off && !hasOff) Html.domlib.classListAdd(node, off);
            }
            
            return flag;
        };
    };
});
