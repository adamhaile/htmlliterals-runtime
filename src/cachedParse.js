define('cachedParse', ['parse'], function (parse) {
    var cache = {};

    return function cachedParse(id, html) {
        var cached = cache[id];

        if (cached === undefined) {
            cached = parse(html);
            cache[id] = cached;
        }

        return cached.cloneNode(true);
    }
})
