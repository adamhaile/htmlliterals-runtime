(function () {
    // nano-implementation of require.js-like define(name, deps, impl) for internal use
    (function (package) {
        var definitions = {},
            publish = {};

        package(function define(name, deps, fn) {
            if (definitions.hasOwnProperty(name)) throw new Error("define: cannot redefine module " + name);
            definitions[name] = fn.apply(null, deps.map(function (dep) {
                if (!definitions.hasOwnProperty(dep)) throw new Error("define: module " + dep + " required by " + name + " has not been defined.");
                return definitions[dep];
            }));
        });

        if (typeof exports === 'object') publish = exports; // CommonJS
        else if (typeof define === 'function') define([], function () { return publish; }); // AMD
        else publish = this.htmlliterals = this.htmlliterals || publish; // fallback to global object

        publish.Shell      = definitions.Shell;
        publish.parse      = definitions.parse;
        publish.directives = definitions.directives;

    })(function (define) {
