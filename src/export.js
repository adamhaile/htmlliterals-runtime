define('export', ['parse', 'cachedParse', 'Shell', 'directives', 'domlib'], function (parse, cachedParse, Shell, directives, domlib) {
    return {
        parse: parse,
        cachedParse: cachedParse,
        Shell: Shell,
        directives: directives,
        domlib: domlib
    };
});
