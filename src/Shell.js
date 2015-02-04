define('Shell', ['parse', 'cachedParse'], function (parse, cachedParse) {
    function Shell(node, cache) {
        if (node.nodeType === undefined)
            node = cache ? cachedParse(node, cache) : parse(node);

        this.node = node;
    }

    Shell.prototype = {
        childNodes: function childNodes(indices, fn) {
            var children = this.node.childNodes,
                len = indices.length,
                childShells = new Array(len),
                i, child;

            if (children === undefined)
                throw new Error("Shell.childNodes can only be applied to a node with a \n"
                    + ".childNodes collection.  Node ``" + this.node + "'' does not have one. \n"
                    + "Perhaps you applied it to the wrong node?");

            for (i = 0; i < len; i++) {
                child = children[indices[i]];
                if (!child)
                    throw new Error("Node ``" + this.node + "'' does not have a child at index " + i + ".");

                childShells[i] = new Shell(child);
            }

            fn(childShells);

            return this;
        },

        property: function property(setter) {
            setter(this.node);
            return this;
        }
    };

    Shell.addDirective = function addDirective(name, fn) {
        Shell.prototype[name] = function directive(values) {
            Shell.execDirective(fn, this.node, values);
            return this;
        };
    };

    Shell.execDirective = function execDirective(fn, node, values) {
        values(fn(node));
    };

    Shell.cleanup = function (node, fn) {
        // nothing right now -- this is primarily a hook for S.cleanup
        // will consider a non-S design, like perhaps adding a .cleanup()
        // closure to the node.
    };

    return Shell;
});
