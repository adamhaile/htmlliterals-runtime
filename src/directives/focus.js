define('directives.focus', ['Html'], function (Html) {
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
    
    Html.addDirective('focus', function focus(node) {
        if (!node.focus)
            throw new Error("@focus can only be applied to an element that has a .focus() method, like <input>, <select>, <textarea>, etc.");
            
        return function focus(flag, start, end) {
            if (flag) {
                nodeToFocus = node;
                startPos = arguments.length > 1 ? start : NaN;
                endPos = arguments.length > 2 ? end : startPos;
                if (!scheduled) window.requestAnimationFrame(focuser);
            } else {
                node.blur();
            }
        };
    });
    
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
            } else if (Html.domlib.isContentEditable(nodeToFocus) && nodeToFocus.childNodes.length > 0) {
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
