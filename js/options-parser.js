var $ = window.$,
    _ = require('./utils'),

    namedColors    = require('./named-colors'),
    colorConverter = require('./color-converter'),

    TRIM = 25,

    defaults = {
        alwaysOpen: false,
        disabled: false
        // hsl
        // color
        // disableInputs
    };

var parseColor = function(color) {
    if (!color || color === 'random') {
        // random color
        return {
            h: colorConverter.random(TRIM),
            s: colorConverter.random(TRIM),
            l: colorConverter.random(TRIM)
        };
    }

    if (_.isString(color)) {
        // lookup color if need be
        var color = (color[0] !== '#') ? namedColors.lookup(color) : color,
            rgbArr = colorConverter.hexToRgb(color),
            hslArr = colorConverter.rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]);
        return {
            h: hslArr[0],
            s: hslArr[1],
            l: hslArr[2]
        };
    }

    if (_.isArray(color)) {
        return {
            h: color[0],
            s: color[1],
            l: color[2]
        };
    }

    // must be an obj
    return {
        h: color.h,
        s: color.s,
        l: color.l
    };
};

var parseDisabledBars = function(opts) {
    opts = opts || {};

    // is a string or an array
    if (_.isString(opts) || _.isArray(opts)) {
        var obj = {},
            str = opts,
            idx = 0, length = str.length;
        for (; idx < length; idx++) {
            var cha = str[idx];
            if (cha === 'h' || cha === 's' || cha === 'l') {
                obj[cha] = true;
            }
        }

        return obj;
    }

    // must be an object, make sure it's valid
    return {
        h: !!opts.h,
        s: !!opts.s,
        l: !!opts.l
    };
};

var parse = module.exports = function(opts, color) {
    opts = opts || {};

    return $.extend({}, defaults, opts, {
        hsl:          parseColor(opts.hsl || opts.color || color),
        disableInputs: parseDisabledBars(opts.disableInputs)
    });
};
parse.color = parseColor;
parse.disableInputs = parseDisabledBars;
