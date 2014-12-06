define('directives.insert', ['directives'], function (directives) {
    directives.insert = function(node) {
        var parent,
            start;

        return function (value) {
            parent = node.parentNode;

            if (!parent)
                throw new Error("@insert can only be used on a node that has a parent node. \n"
                    + "Node ``" + node + "'' is currently unattached to a parent.");

            if (start) {
                if (start.parentNode !== parent)
                    throw new Error("@insert requires that the inserted nodes remain sibilings \n"
                        + "of the original node.  The DOM has been modified such that this is \n"
                        + "no longer the case.");

                clear(start, node);
            } else start = marker(node);

            insert(value);
        };

        // value ::
        //   null or undefined
        //   string
        //   node
        //   array of value
        function insert(value) {
            if (value === null || value === undefined) {
                // nothing to insert
            } else if (value.nodeType /* instanceof Node */) {
                parent.insertBefore(value, node);
            } else if (Array.isArray(value)) {
                insertArray(value);
            } else {
                parent.insertBefore(document.createTextNode(value.toString()), node);
            }
        }

        function insertArray(array) {
            var i, len, prev;
            for (i = 0, len = array.length; i < len; i++) {
                insert(array[i]);
                // if we've enjambed two text nodes, separate them with a space
                if (prev
                    && prev.nodeType == 3
                    && prev.nextSibling !== node
                    && prev.nextSibling.nodeType === 3)
                {
                    parent.insertBefore(document.createTextNode(" "), prev.nextSibling);
                }
                prev = node.previousSibling;
            }
        }

        function clear(start, end) {
            var next = start.nextSibling;
            while (next !== end) {
                parent.removeChild(next);
                next = start.nextSibling;
            }
        }

        function marker(el) {
            return parent.insertBefore(document.createTextNode(""), el);
        }
    };
});
