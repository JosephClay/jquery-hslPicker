var $ = window.$,

    bars = $.map(['h', 's', 'l'], function(val) {
        return '<div class="hsl-slider">' +
            '<div class="hsl-bar" data-hsl-bar="'+ val +'">' +
                '<div class="hsl-handle" data-hsl-handle></div>' +
            '</div>' +
            '<input class="hsl-input" type="text">' +
        '</div>';
    }),

    MODAL = '<div class="hsl-picker">' +
                '<div class="hsl-display-foreground">' +
                    '<div class="hsl-display" data-hsl-display></div>' +
                '</div>' +
                '<div class="hsl-bars">' +
                    bars.join('') +
                '</div>' +
            '</div>';

module.exports = function() {
    return $(MODAL);
};