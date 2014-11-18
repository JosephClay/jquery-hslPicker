var $ = window.$,

    base64 = require('./base-64'),

    svg = function(stops) {
        // http://ie.microsoft.com/testdrive/graphics/svggradientbackgroundmaker/default.html
        return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">' +
            '<linearGradient id="g119" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">' +
                stops.join('') +
            '</linearGradient>' +
            '<rect x="0" y="0" width="1" height="1" fill="url(#g119)" />' +
        '</svg>';
    },

    colorStop = function(color, offset) {
        return '<stop stop-color="'+ color +'" offset="' + offset +'"/>';
    };

module.exports = function(colors) {
    var len = colors.length,
        inc = 1 / (len - 1),
        stops = $.map(colors, function(value, idx) {
            return colorStop(
                // color
                value,
                // offset
                inc * idx
            );
        });

    return 'background: url(data:image/svg+xml;base64,'+ base64.encode(svg(stops)) +');';
};