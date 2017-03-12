(function (package) {
    // nano-implementation of require.js-like define(name, deps, impl) for internal use
    var definitions = {},
        symbol = 'Html';

    package(function define(name, deps, fn) {
        if (definitions.hasOwnProperty(name)) throw new Error("define: cannot redefine module " + name);
        definitions[name] = fn.apply(null, deps.map(function (dep) {
            if (!definitions.hasOwnProperty(dep)) throw new Error("define: module " + dep + " required by " + name + " has not been defined.");
            return definitions[dep];
        }));
    });

    if (typeof module === 'object' && typeof module.exports === 'object')  // CommonJS
        module.exports = definitions[symbol];
    else if (typeof define === 'function')  // AMD
        define([], function () { return definitions[symbol]; });
    else // new global object
        this[symbol] = definitions[symbol];

})(function (define) {
    "use strict";

// internal cross-browser library of required DOM functions
define('domlib', [], function () {
    // default (conformant) implementations
    var domlib = {
        addEventListener: function addEventListener(node, event, fn) {
            node.addEventListener(event, fn, false);
        },

        removeEventListener: function removeEventListener(node, event, fn) {
            node.removeEventListener(event, fn);
        },

        classListContains: function (el, name) {
            return el.classList.contains(name);
        },

        classListAdd: function (el, name) {
            return el.classList.add(name);
        },

        classListRemove: function (el, name) {
            return el.classList.remove(name);
        },
        
        isContentEditable: function (el) {
            return el.isContentEditable;
        },
        
        isAttachedToDocument: function (el) {
            return (document.compareDocumentPosition(el) & 1) === 0;
        }
    };
    
    // shims for broken and/or older browsers
    if (!browserSetsIsContentEditablePropertyReliably())
        useContentEditableAttribute();
    
    return domlib;
    
    // Element.isContentEditable is currently broken on Chrome.  It returns false for non-displayed elements. See https://code.google.com/p/chromium/issues/detail?id=313082 .
    function browserSetsIsContentEditablePropertyReliably() {
        var div = document.createElement("div");
        div.innerHTML = '<div contentEditable="true"></div>';
        return div.children[0].isContentEditable === true;
    }
    
    function useContentEditableAttribute() {
        domlib.isContentEditable = function (el) {
            var contentEditable = el.getAttribute("contentEditable");
            return contentEditable === "true" || contentEditable === "";
        }
    }
});

define('Html', ['domlib'], function (domlib) {
    return {
        exec: function exec(fn) {
            fn();
        },

        cleanup: function (node, fn) {
            // nothing right now -- this is primarily a hook for S.cleanup
            // will consider a non-S design, like perhaps adding a .cleanup()
            // closure to the node.
        },

        domlib: domlib
    };
});

define('Html.insert', ['Html'], function (Html) {
    var DOCUMENT_FRAGMENT_NODE = 11,
        TEXT_NODE = 3;
        
    Html.insert = function insert(range, value) {
        var parent = range.start.parentNode, 
            test = range.start,
            good = null,
            t = typeof value;

        //if (parent === null) {
        //    throw new Error("Html.insert() can only be used on a node that has a parent node. \n"
        //        + "Node ``" + range.start + "'' is currently unattached to a parent.");
        //}

        //if (range.end.parentNode !== parent) {
        //    throw new Error("Html.insert() requires that the inserted nodes remain sibilings \n"
        //        + "of the original node.  The DOM has been modified such that this is \n"
        //        + "no longer the case.");
        //}

        if (t === 'string' || t === 'number' || t === 'boolean') {
            if (test.nodeType === TEXT_NODE) {
                test.data = value;
                good = test;
            } else {
                value = document.createTextNode(value);
                parent.replaceChild(value, test);
                if (range.end === test) range.end = value;
                range.start = good = value;
            }
        } else if (value instanceof Node) {
            if (test !== value) {
                parent.replaceChild(value, test);
                if (range.end === test) range.end = value;
                range.start = value;
            }
            good = value;
        } else if (value instanceof Array) {
            insertArray(value);
        } else if (value instanceof Function) {
            Html.exec(function () {
                insert(range, value());
            });
            good = range.end;
        } else if (value !== null && value !== undefined) {
            value = value.toString();

            if (test.nodeType === TEXT_NODE) {
                test.data = value;
                good = test;
            } else {
                value = document.createTextNode(value);
                parent.replaceChild(value, test);
                if (range.end === test) range.end = value;
                range.start = good = value;
            }
        }

        if (good === null) {
            if (range.start === parent.firstChild && range.end === parent.lastChild && range.start !== range.end) {
                // fast delete entire contents
                parent.textContent = "";
                value = document.createTextNode("");
                parent.appendChild(value);
                good = range.start = range.end = value;
            } else if (test.nodeType === TEXT_NODE) {
                test.data = "";
                good = test;
            } else {
                value = document.createTextNode("");
                parent.replaceChild(value, test);
                if (range.end === test) range.end = value;
                range.start = good = value;
            }
        }

        // remove anything left after the good cursor from the insert range
        while (good !== range.end) {
            test = range.end;
            range.end = test.previousSibling;
            parent.removeChild(test);
        }

        return range;

        function insertArray(array) {
            for (var i = 0, len = array.length; i < len; i++) {
                var value = array[i];
                if (good === range.end) {
                    if (value instanceof Node) {
                        good = range.end = (good.nextSibling ? parent.insertBefore(value, good.nextSibling) : parent.appendChild(value));
                    } else if (value instanceof Array) {
                        insertArray(value);
                    } else if (value !== null && value !== undefined) {
                        value = document.createTextNode(value.toString());
                        good = range.end = (good.nextSibling ? parent.insertBefore(value, good.nextSibling) : parent.appendChild(value));
                    }
                } else {
                    if (value instanceof Node) {
                        if (test !== value) {
                            if (good === null) {
                                parent.replaceChild(value, test);
                                range.start = value;
                                if (range.end === test) range.end = value;
                                test = value.nextSibling;
                            } else {
                                if (test.nextSibling === value && test !== value.nextSibling && test !== range.end) {
                                    parent.removeChild(test);
                                    test = value.nextSibling;
                                } else {
                                    parent.insertBefore(value, test);
                                }
                            }
                        } else {
                            test = test.nextSibling;
                        }
                        good = value;
                    } else if (value instanceof Array) {
                        insertArray(value);
                    } else if (value !== null && value !== undefined) {
                        value = value.toString();

                        if (test.nodeType === TEXT_NODE) {
                            test.data = value;
                            if (good === null) range.start = test;
                            good = test, test = good.nextSibling;;
                        } else {
                            value = document.createTextNode(value);
                            parent.insertBefore(value, test);
                            if (good === null) range.start = value;
                            good = value;
                        }
                    }
                }
            }
        }
    };
});

define('Html.attr', ['Html'], function (Html) {
    Html.attr = function attr(name, value) {
        return function attr(node) {
            node.setAttribute(name, value);
        };
    };
});

define('Html.class', ['Html', 'domlib'], function (Html, domlib) {
    Html.class = function classMixin(on, off, flag) {            
        if (arguments.length < 3) flag = off, off = null;
            
        return function classMixin(node, state) {
            if (node.className === undefined)
                throw new Error("@class can only be applied to an element that accepts class names. \n"
                    + "Element ``" + node + "'' does not. Perhaps you applied it to the wrong node?");
                    
            if (flag === state) return state;

            var hasOn = domlib.classListContains(node, on),
                hasOff = off && domlib.classListContains(node, off);

            if (flag) {
                if (!hasOn) domlib.classListAdd(node, on);
                if (off && hasOff) domlib.classListRemove(node, off);
            } else {
                if (hasOn) domlib.classListRemove(node, on);
                if (off && !hasOff) domlib.classListAdd(node, off);
            }
            
            return flag;
        };
    };
});

define('Html.focus', ['Html', 'domlib'], function (Html, domlib) {
    /**
     * In htmlliterals, directives run when a node is created, meaning before it has usually
     * been inserted into the document.  This causes a problem for the @focus directive, as only
     * elements that are in the document (and visible) are focusable.  As a hack, we delay
     * the focus event until the next animation frame, thereby giving htmlliterals a chance
     * to get the node into the document.  If it isn't in by then (or if the user tried to focus
     * a hidden node) then we give up.
     */
    var nodeToFocus = null,
        startPos = NaN,
        endPos = NaN,
        scheduled = false;
    
    Html.focus = function focus(flag, start, end) {
        start = arguments.length > 1 ? start : NaN;
        end = arguments.length > 2 ? end : start;
        
        return function focus(node) {
            if (!node.focus) {
                throw new Error("@focus can only be applied to an element that has a .focus() method, like <input>, <select>, <textarea>, etc.");
            }
                
            if (flag) {
                nodeToFocus = node;
                startPos = start;
                endPos = end;
                if (!scheduled) window.requestAnimationFrame(focuser);
            } else {
                node.blur();
            }
        };
    };
    
    function focuser() {
        scheduled = false;
        
        var start = startPos < 0 ? nodeToFocus.textContent.length + startPos + 1 : startPos,
            end = endPos < 0 ? nodeToFocus.textContent.length + endPos + 1 : endPos,
            range, sel;
        
        nodeToFocus.focus();
        
        if (!isNaN(start)) {
            if (nodeToFocus.setSelectionRange) {
                nodeToFocus.setSelectionRange(start, end);
            } else if (nodeToFocus.createTextRange) {
                range = nodeToFocus.createTextRange();
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            } else if (domlib.isContentEditable(nodeToFocus) && nodeToFocus.childNodes.length > 0) {
                range = document.createRange();
                range.setStart(nodeToFocus.childNodes[0], start);
                range.setEnd(nodeToFocus.childNodes[0], end);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
});

define('Html.onkey', ['Html', 'domlib'], function (Html, domlib) {
    Html.onkey = function onkey(key, event, fn) {
        if (arguments.length < 3) fn = event, event = 'down';

        var parts = key.toLowerCase().split('-', 2),
            keyCode = keyCodes[parts[parts.length - 1]],
            mod = parts.length > 1 ? parts[0] + "Key" : null;

        if (keyCode === undefined)
            throw new Error("@Html.onkey: unrecognized key identifier '" + key + "'");

        if (typeof fn !== 'function')
            throw new Error("@Html.onkey: must supply a function to call when the key is entered");
            
        return function (node) {
            domlib.addEventListener(node, 'key' + event, onkeyListener);
            Html.cleanup(node, function () { domlib.removeEventListener(node, 'key' + event, onkeyListener); });
        };
        
        function onkeyListener(e) {
            if (e.keyCode === keyCode && (!mod || e[mod])) fn(e);
            return true;
        }
    };

    var keyCodes = {
        backspace:  8,
        tab:        9,
        enter:      13,
        shift:      16,
        ctrl:       17,
        alt:        18,
        pause:      19,
        break:      19,
        capslock:   20,
        esc:        27,
        escape:     27,
        space:      32,
        pageup:     33,
        pagedown:   34,
        end:        35,
        home:       36,
        leftarrow:  37,
        uparrow:    38,
        rightarrow: 39,
        downarrow:  40,
        prntscrn:   44,
        insert:     45,
        delete:     46,
        "0":        48,
        "1":        49,
        "2":        50,
        "3":        51,
        "4":        52,
        "5":        53,
        "6":        54,
        "7":        55,
        "8":        56,
        "9":        57,
        a:          65,
        b:          66,
        c:          67,
        d:          68,
        e:          69,
        f:          70,
        g:          71,
        h:          72,
        i:          73,
        j:          74,
        k:          75,
        l:          76,
        m:          77,
        n:          78,
        o:          79,
        p:          80,
        q:          81,
        r:          82,
        s:          83,
        t:          84,
        u:          85,
        v:          86,
        w:          87,
        x:          88,
        y:          89,
        z:          90,
        winkey:     91,
        winmenu:    93,
        f1:         112,
        f2:         113,
        f3:         114,
        f4:         115,
        f5:         116,
        f6:         117,
        f7:         118,
        f8:         119,
        f9:         120,
        f10:        121,
        f11:        122,
        f12:        123,
        numlock:    144,
        scrolllock: 145,
        ",":        188,
        "<":        188,
        ".":        190,
        ">":        190,
        "/":        191,
        "?":        191,
        "`":        192,
        "~":        192,
        "[":        219,
        "{":        219,
        "\\":       220,
        "|":        220,
        "]":        221,
        "}":        221,
        "'":        222,
        "\"":       222
    };
});

});
