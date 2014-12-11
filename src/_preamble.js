(function (package) {
    // nano-implementation of require.js-like define(name, deps, impl) for internal use
    var definitions = {},
        symbol = 'htmlliterals',
        p;

    package(function define(name, deps, fn) {
        if (definitions.hasOwnProperty(name)) throw new Error("define: cannot redefine module " + name);
        definitions[name] = fn.apply(null, deps.map(function (dep) {
            if (!definitions.hasOwnProperty(dep)) throw new Error("define: module " + dep + " required by " + name + " has not been defined.");
            return definitions[dep];
        }));
    });

    if (typeof module === 'object' && typeof module.exports === 'object')  // CommonJS
        module.exports = definitions.export;
    else if (typeof define === 'function')  // AMD
        define([], function () { return definitions.export; });
    else if (typeof this[symbol] !== 'undefined') // existing global object
        for (p in definitions.export) this[symbol][p] = definitions.export[p];
    else // new global object
        this[symbol] = definitions.export;

})(function (define) {
    "use strict";
