define('directives.insert', ['Shell'], function (Shell) {
    Shell.addDirective('insert', function (node) {
        var parent,
            start,
            cursor;

        return function insert(value) {
            parent = node.parentNode;

            if (!parent)
                throw new Error("@insert can only be used on a node that has a parent node. \n"
                    + "Node ``" + node + "'' is currently unattached to a parent.");

            if (start) {
                if (start.parentNode !== parent)
                    throw new Error("@insert requires that the inserted nodes remain sibilings \n"
                        + "of the original node.  The DOM has been modified such that this is \n"
                        + "no longer the case.");

                //clear(start, node);
            } else start = marker(node);

            cursor = start;

            insert(value);

            clear(cursor, node);
        };

        // value ::
        //   null or undefined
        //   string
        //   node
        //   array of value
        function insertValue(value) {
            var next = cursor.nextSibling;

            if (value === null || value === undefined) {
                // nothing to insert
            } else if (value.nodeType /* instanceof Node */) {
                if (next !== value) {
                    parent.insertBefore(value, next);
                }
                cursor = value;
            } else if (Array.isArray(value)) {
                insertArray(value);
            } else {
                value = value.toString();

                if (next.nodeType !== 3 || next.data !== value) {
                    cursor = parent.insertBefore(document.createTextNode(value), next);
                } else {
                    cursor = next;
                }
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
    });
});
