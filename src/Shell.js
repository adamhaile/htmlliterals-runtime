define('Shell', ['directives'], function (directives) {
    function Shell(node) {
        if (node.nodeType === undefined)
            throw new Error("Shell can only wrap a DOM node.  Value ``" + node + "'' is not a DOM node.")
        this.node = node;
    }

    Shell.prototype = {
        childNodes: function children(indices, fn) {
            var childNodes = this.node.childNodes,
                len = indices.length,
                childShells = new Array(len),
                i, child;

            if (childNodes === undefined)
                throw new Error("Shell.childNodes can only be applied to a node with a \n"
                    + ".childNodes collection.  Node ``" + this.node + "'' does not have one. \n"
                    + "Perhaps you applied it to the wrong node?");

            for (i = 0; i < len; i++) {
                child = childNodes[indices[i]];
                if (!child)
                    throw new Error("Node ``" + this.node + "'' does not have a child at index " + i + ".");

                childShells[i] = new Shell(child);
            }

            fn(childShells);

            return this;
        },

        directive: function directive(name, values) {
            var fn = directives[name];

            if (typeof fn !== 'function')
                throw new Error("No directive registered with name: " + name);

            values(fn(this.node));

            return this;
        },

        property: function property(setter) {
            setter(this.node);
            return this;
        }
    };

    return Shell;
});
