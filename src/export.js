define('export', ['parse', 'cachedParse', 'Shell', 'domlib'], function (parse, cachedParse, Shell, domlib) {
    return {
        parse: parse,
        cachedParse: cachedParse,
        Shell: Shell,
        domlib: domlib
    };
});
