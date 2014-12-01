(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $              = window.$,
    NAME           = 'hslPicker',
    colorConverter = require('./color-converter'),
    Picker         = require('./Picker');

$.hslPicker = $.extend(Picker, colorConverter);
$.fn[NAME] = function(options) {

    if (options === 'picker') {
        return this.data(NAME);
    }
    if (options === 'destroy') {
        var inst = this.data(NAME);
        if (inst) {
            inst.destroy();
            return this;
        }
    }

    return this.each(function() {
        var elem = this;
        if (!$.data(elem, NAME)) {
            $.data(elem, NAME, new Picker(elem, options));
        }
    });
};

if (typeof exports === 'object') {
    module.exports = $.hslPicker;
}
},{"./Picker":10,"./color-converter":11}],2:[function(require,module,exports){
module.exports = function(colors) {
    var baseColor = colors[0],
        gradients = colors.join(', ');

    return 'background-color: '+ baseColor +'; ' +
            'background-image: -webkit-linear-gradient(left, '+ gradients +'); ' + // Chrome 10-25, iOS 5+, Safari 5.1+
            'background-image: linear-gradient(to right, '+ gradients +');'; // Chrome 26, Firefox 16+, IE 10+, Opera
};
},{}],3:[function(require,module,exports){
var supportsCSS3Gradients = require('./supports-css3-gradients'),
    css3Grad = require('./css3-grad'),
    svgGrad = require('./svg-grad');

module.exports = supportsCSS3Gradients ? css3Grad : svgGrad;
},{"./css3-grad":2,"./supports-css3-gradients":4,"./svg-grad":6}],4:[function(require,module,exports){
var div = document.createElement('div'),

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

var setCss = function(str) {
    div.style.cssText = str;
};

var contains = function(str, substr) {
    return !!~('' + str).indexOf(substr);
};

var supports_gradients = function() {
    /**
     * For CSS Gradients syntax, please see:
     * webkit.org/blog/175/introducing-css-gradients/
     * developer.mozilla.org/en/CSS/-moz-linear-gradient
     * developer.mozilla.org/en/CSS/-moz-radial-gradient
     * dev.w3.org/csswg/css3-images/#gradients-
     */
    var str1 = 'background-image:',
        str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
        str3 = 'linear-gradient(left top,#9f9, white);';

    setCss(
         // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
          (str1 + '-webkit- '.split(' ').join(str2 + str1)
         // standard syntax             // trailing 'background-image:'
          + prefixes.join(str3 + str1)).slice(0, -str1.length)
    );

    return contains(div.style.backgroundImage, 'gradient');
};

module.exports = supports_gradients();

div = null;
},{}],5:[function(require,module,exports){
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

// modified to only encode...we don't
// need the decode portion

// private property
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// private method for UTF-8 encoding
var utf8_encode = function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
};

module.exports = {

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);

        }

        return output;
    }
};
},{}],6:[function(require,module,exports){
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
},{"./base-64":5}],7:[function(require,module,exports){
var $   = window.$,
    doc = $(document),

    gradientGenerator = require('./gradient-generator'),
    rgbToString       = require('../../rgb-to-string'),
    colorConverter    = require('../../color-converter'),

    DISABLED_CLASS = 'hsl-disabled';

var ensureOffsetX = function(elem, e) {
    if (e.offsetX !== undefined) { return e; }

    e.offsetX = e.pageX - $(elem).offset().left;
    return e;
};

var Slider = module.exports = function(elem, opts) {
    this.bar = $(elem);
    this.key = opts.key;
    this.value = opts.value || 0;

    this._min = opts.min || 0;
    this._max = opts.max || 360;
};

Slider.prototype = {
    init: function() {
        this._input = this.bar.siblings('input');
        this._barWidth = this.bar.width();
        this._handle = this.bar.find('[data-hsl-handle]');
        this._handleWidth = this._handle.width();

        this._bind();
        this._select(this.value);
    },

    on: function(name, callback) {
        this.bar.on(name, callback);
        return this;
    },

    _bind: function() {
        var self = this;

        this._handle.on('mousedown touchstart', function(e) {
                if (self.disabled) { return; }

                self._mousedown(ensureOffsetX(this, e));
            })
            .on('click tap', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

        this.bar.on('click tap', function(e) {
            if (self.disabled) { return; }

            self._click(ensureOffsetX(this, e));
        });

        var input = this._input,
            min = this._min,
            max = this._max;
        input.on('change', function(e) {
            var val = +input.val();
            if (self.disabled || isNaN(val)) {
                self.select(self.value);
                return false;
            }

            // constrain the value
            val = val > max ? max : val < min ? min : val;

            var perc = val / max;
            self.select(perc);
        });
    },
    _unbind: function() {
        this._handle.off('mousedown touchend');
        this.bar.off('click tap');
    },

    _pick: function(left) {
        var max = this._barWidth - this._handleWidth,
            perc = left / max,
            value = ~~(this._max * perc);

        this._input.val(value);

        return value;
    },

    _trigger: function(value) {
        // no change
        if (this.value === value) { return; }

        this.bar.trigger('update', {
            value: (this.value = value),
            perc: (value / this._max)
        });
    },

    select: function(perc) {
        var max = this._barWidth - this._handleWidth,
            posX = max * perc;

        this._trigger(
            this._moveHandle(posX)
                ._pick(posX)
        );

        return this;
    },

    _select: function(perc) {
        var max = this._barWidth - this._handleWidth,
            posX = max * perc;

        this._moveHandle(posX)
            ._pick(posX);

        return this;
    },

    _constrainHandle: function(to) {
        var min = 0,
            max = this._barWidth - this._handleWidth,
            left = (to <= min) ? min : (to > max) ? max : to;

        return left;
    },

    _moveHandle: function(left) {
        this._handle.css('left', left);

        return this;
    },

    _click: function(e) {
        var centerX = e.offsetX - (this._handleWidth / 2),
            posX = this._constrainHandle(centerX);

        this._trigger(
            this._moveHandle(posX)
                ._pick(posX)
        );
    },

    _mousedown: function(event) {
        var self = this,
            startX = event.offsetX,
            barX = this.bar.offset().left;

        doc.on('mousemove touchmove', function(e) {
                var newX = (e.pageX - barX) - startX,
                    posX = self._constrainHandle(newX);
                self._trigger(
                    self._moveHandle(posX)
                        ._pick(posX)
                );
            })
            .on('mouseup touchend', function() {
                doc.off('mousemove touchmove').off('mouseup touchend');
            });
    },

    disable: function() {
        this.disabled = true;

        this.bar.addClass(DISABLED_CLASS);
        this._input.addClass(DISABLED_CLASS)
            .prop('disabled', true);
    },

    enable: function() {
        this.disabled = false;

        this.bar.removeClass(DISABLED_CLASS);
        this._input.removeClass(DISABLED_CLASS)
            .prop('disabled', false);
    },

    background: function(h, s, l) {
        var grad,
            hslToRgb = colorConverter.hslToRgb;

        if (this.key === 'h') {
            grad = gradientGenerator([
                rgbToString(hslToRgb(0,   s, l)),
                rgbToString(hslToRgb(1/4, s, l)),
                rgbToString(hslToRgb(1/3, s, l)),
                rgbToString(hslToRgb(1/2, s, l)),
                rgbToString(hslToRgb(2/3, s, l)),
                rgbToString(hslToRgb(3/4, s, l)),
                rgbToString(hslToRgb(1,   s, l))
            ]);
        }

        if (this.key === 's') {
            grad = gradientGenerator([
                rgbToString(hslToRgb(h, 0,   l)),
                rgbToString(hslToRgb(h, 1/4, l)),
                rgbToString(hslToRgb(h, 1/3, l)),
                rgbToString(hslToRgb(h, 1/2, l)),
                rgbToString(hslToRgb(h, 2/3, l)),
                rgbToString(hslToRgb(h, 3/4, l)),
                rgbToString(hslToRgb(h, 1,   l))
            ]);
        }

        if (this.key === 'l') {
            grad = gradientGenerator([
                rgbToString(hslToRgb(h, s, 0)),
                rgbToString(hslToRgb(h, s, 1/4)),
                rgbToString(hslToRgb(h, s, 1/3)),
                rgbToString(hslToRgb(h, s, 1/2)),
                rgbToString(hslToRgb(h, s, 2/3)),
                rgbToString(hslToRgb(h, s, 3/4)),
                rgbToString(hslToRgb(h, s, 1))
            ]);
        }

        this.bar.attr('style', grad);
    },

    destroy: function() {
        this._unbind();
        this.bar = this._input = null;
    }
};
},{"../../color-converter":11,"../../rgb-to-string":14,"./gradient-generator":3}],8:[function(require,module,exports){
var $        = window.$,
    win      = $(window),
    doc      = $(document),

    _              = require('../utils'),
    template       = require('./template'),
    Slider         = require('./Slider'),

    DELAY   = 150,
    PADDING = 50;

var Modal = module.exports = function() {
    this.elem = template();
    this.display = this.elem.find('[data-hsl-display]');
    // this._isOpen = false;
    // this._alwaysOpen = false;
    this._bars = {};
};

Modal.prototype = {
    on: function(name, callback) {
        this.elem.on(name, callback);
        return this;
    },

    init: function(opts) {
        var hsl = opts.hsl,
            disableInputs = opts.disableInputs;
        _.reduce(this.elem.find('[data-hsl-bar]'), function(bars, elem) {

            var key = elem.getAttribute('data-hsl-bar'),
                slider = bars[key] = new Slider(elem, {
                    key:   key,
                    value: hsl[key],
                    max:   key === 'h' ? 100 : 360
                });

            slider.init();
            if (disableInputs[key]) { slider.disable(); }

            return bars;

        }, this._bars);

        this._bind();
        this._bindDoc();
        this._bindBars();
    },

    _bind: function() {
        this.elem.on('click tap', function(e) {
            e.stopPropagation();
        });
    },

    _bindDoc: function() {
        var self = this;
        doc.on('click tap', function() {
            if (!self._isOpen) { return; }

            self.close();
        });
    },

    _bindBars: function() {
        var self = this,
            bars = this._bars;
        _.each(bars, function(bar, key) {
            bar.on('update', function(e, data) {
                self.elem.trigger('update', {
                    key: key,
                    value: data.value || 0,
                    perc: data.perc || 0
                });
            });
        });
    },

    disable: function() {
        this.elem.addClass('hsl-disabled');
        _.each(this._bars, function(bar) {
            bar.disable();
        });
    },
    enable: function() {
        this.elem.removeClass('hsl-disabled');
        _.each(this._bars, function(bar) {
            bar.enable();
        });
    },

    /*
        offset:       swatch.offset(),
        swatchWidth:  swatch.width(),
        swatchHeight: swatch.height(),
        x:            e.offsetX,
        y:            e.offsetY
    */
    open: function(e) {
        if (this._isOpen || this._alwaysOpen) { return this; }
        this._isOpen = true;

        var elem     = this.elem,
            swatch    = this.swatch,

            width     = elem.width(),
            height    = elem.height(),

            offset       = e.swatchOffset,
            swatchWidth  = e.swatchWidth,
            swatchHeight = e.swatchHeight,

            winWidth  = win.width(),
            winHeight = win.height(),

            minX = 0 + (width / 2) + PADDING,
            minY = 0 + (height / 2) + PADDING,

            maxX = winWidth - (width / 2) - PADDING + doc.scrollLeft(),
            maxY = winHeight - (height / 2) - PADDING + doc.scrollTop(),

            centerX = offset.left + swatchWidth / 2,
            centerY = offset.top + swatchHeight / 2;

        // constrain x < 0
        centerX = centerX < minX ? minX : centerX;
        // constrain x > max
        centerX = centerX > maxX ? maxX : centerX;
        // constrain y < 0
        centerY = centerY < minY ? minY : centerY;
        // constrain y > max
        centerY = centerY > maxY ? maxY : centerY;

        elem.css({
            top: centerY,
            left: centerX
        }).addClass('hsl-show').addClass('hsl-open');

        var input = this._getInput();
        setTimeout(function() {
            input.focus();
        }, DELAY);

        return this;
    },

    _getInput: function() {
        return this._firstInput || (this._firstInput = this.elem.find('input').first());
    },

    close: function() {
        if (!this._isOpen || this._alwaysOpen) { return this; }
        this._isOpen = false;

        var elem = this.elem;
        elem.removeClass('hsl-open');
        setTimeout(function() {
            elem.removeClass('hsl-show');
        }, DELAY);

        return this;
    },

    enableInputs: function(opts) {
        var bars = this._bars;
        _.each(opts, function(value, key) {
            if (!value) { return; }
            bars[key].enable();
        });
    },

    disableInputs: function(opts) {
        var bars = this._bars;
        _.each(opts, function(value, key) {
            if (!value) { return; }
            bars[key].disable();
        });
    },

    setDisplayBackground: function(color) {
        this.display.css('background-color', color);

        return this;
    },

    setBarBackgrounds: function(h, s, l) {
        _.each(this._bars, function(bar) {
            bar.background(h, s, l);
        });

        return this;
    },

    update: function(hsl) {
        var bars = this._bars;
        _.each(hsl, function(value, key) {
            // expected to be a percent
            if (_.isNumber(value) && !isNaN(value) && value >= 0 && value <= 1) {
                bars[key].select(value);
            }
        });
    },

    alwaysOpen: function() {
        this._alwaysOpen = true;
        this.elem.addClass('hsl-always-open')
            .addClass('hsl-show')
            .addClass('hsl-open');

    },

    destroy: function() {
        _.each(this._bars, function(bar) {
            bar.destroy();
        });

        this.elem.remove();
        this.elem = this.display = this._bars = null;
    }
};
},{"../utils":16,"./Slider":7,"./template":9}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
var $              = window.$,
    _              = require('./utils'),

    Modal          = require('./Modal'),
    swatch         = require('./swatch'),
    optionsParser  = require('./options-parser'),
    rgbToString    = require('./rgb-to-string'),
    colorConverter = require('./color-converter'),

    body = (function() {
        var bod;
        return function() {
            return bod || (bod = $('body'));
        };
    }()),

    // namespace
    ns = '.hsl-picker';

var Picker = module.exports = function(input, options) {
    this.input = $(input);
    this.opts = optionsParser(options, this.input.val());
    this.swatch = swatch();
    this.modal = new Modal();

    var hsl = this.opts.hsl;
    this.h = hsl.h;
    this.s = hsl.s;
    this.l = hsl.l;

    this.isDisabled = false;

    // append the modal right away
    // so that bars can be measured.
    // the modal is hidden so there's
    // no FOUS
    body().append(this.modal.elem);
    this.modal.init(this.opts);

    this._bindSwatch();
    this._bindModal();
    this._bindInput();
    this.refresh();

    if (this.opts.disabled || this.input.is(':disabled')) { this.disable(); }
    if (this.opts.alwaysOpen) {
        this.modal.alwaysOpen();
        this.input.after(this.modal.elem);
    }

    // append the swatch after the refresh
    // so that it shows the correct color
    if (!this.opts.alwaysOpen) {
        this.input.after(this.swatch);
    }
};

Picker.prototype = {

    _bindSwatch: function() {
        var self = this;
        this.swatch.on('click tap', function(e) {
            if (self.isDisabled) { return; }

            e.stopPropagation();
            self.open(e);
        });
    },

    _bindModal: function() {
        var self = this;
        this.modal.on('update', function(e, data) {
            self[data.key] = data.perc;
            self.refresh();
        });
    },

    _bindInput: function() {
        var self = this,
            input = this.input;
        input.on('update' + ns, function(e, data) {
                var color = data && data.color ? data.color : input.val();
                self.update(color);
            })
            .on('enable' + ns, function() {
                self.enable();
            })
            .on('disable' + ns, function() {
                self.disable();
            })
            .on('close' + ns, function() {
                self.close();
            })
            .on('open' + ns, function() {
                self.open();
            })
            .on('refresh' + ns, function() {
                self.refresh();
            })
            .on('destroy' + ns, function() {
                self.destroy();
            });
    },

    enable: function() {
        this.isDisabled = false;

        this.modal.enable();
        this.swatch.removeClass('hsl-disabled');

        return this;
    },
    enableInputs: function(opts) {
        this.modal.enableInputs(optionsParser.disable(opts));

        return this;
    },

    disable: function() {
        this.isDisabled = true;

        this.modal.close().disable();
        this.swatch.addClass('hsl-disabled');

        return this;
    },
    disableInputs: function(opts) {

        this.modal.disableInputs(optionsParser.disable(opts));
        return this;
    },

    refresh: function() {
        var h = this.h,
            s = this.s,
            l = this.l;

        this.modal.setBarBackgrounds(h, s, l);

        var rgb = colorConverter.hslToRgb(h, s, l),
            color = rgbToString(rgb);
        this.swatch.css('background-color', color);
        this.modal.setDisplayBackground(color);

        var hexValue = colorConverter.rgbToHex(rgb[0], rgb[1], rgb[2]),
            currentVal = this.input.val();

        if (hexValue === currentVal) { return this; }

        this.input.val(hexValue).trigger('change', { color: hexValue });

        return this;
    },

    open: function(e) {
        var swatch = this.swatch;
        this.modal.open({
            swatchOffset: swatch.offset(),
            swatchWidth:  swatch.width(),
            swatchHeight: swatch.height(),
            x:            e.offsetX,
            y:            e.offsetY
        });

        return this;
    },

    close: function() {
        this.modal.close();

        return this;
    },

    update: function(color) {
        if (!color) { return this; }

        // if anything changes, this will call refreshes
        this.modal.update(optionsParser.color(color));

        return this;
    },

    val: function(color) {
        if (color) { return this.update(color); }
        return this.input.val();
    },

    destroy: function() {
        this.input.off('update' + ns)
            .off('enable' + ns)
            .off('disable' + ns)
            .off('close' + ns)
            .off('open' + ns)
            .off('refresh' + ns)
            .off('destroy' + ns);

        this.modal.destroy();
        this.swatch.remove();

        this.input = this.modal = this.swatch = null;
        this.h = this.s = this.l = 0;
    }
};

},{"./Modal":8,"./color-converter":11,"./options-parser":13,"./rgb-to-string":14,"./swatch":15,"./utils":16}],11:[function(require,module,exports){
var rShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,

    rHexToRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

var hue2rgb = function(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
var hslToRgb = function(h, s, l) {
    var r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
            p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
var rgbToHsl = function(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
};

var hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(rShorthand, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = rHexToRgb.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [];
};

var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

var rgbToHex = function(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var hexToHsl = function(hex) {
    var rgb = hexToRgb(hex);
    return rgbToHsl(rgb[0], rgb[1], rgb[2]);
};

// random (mostly neutral) value
var randomPerc = function(trim) {
    trim = trim || 0;
    var max = 100 - trim,
        min = 0 + trim;
    return (Math.floor(Math.random() * max) + min) / 100;
};

module.exports = {
    hslToRgb:    hslToRgb,
    rgbToHsl:    rgbToHsl,
    hexToRgb:    hexToRgb,
    rgbToHex:    rgbToHex,
    hexToHsl:    hexToHsl,
    random:      randomPerc
};
},{}],12:[function(require,module,exports){
var NAMED_COLORS = 'aliceblue|f0f8ff,antiquewhite|faebd7,aqua|00ffff,aquamarine|7fffd4,azure|f0ffff,beige|f5f5dc,bisque|ffe4c4,black|000000,blanchedalmond|ffebcd,blue|0000ff,blueviolet|8a2be2,brown|a52a2a,burlywood|deb887,cadetblue|5f9ea0,chartreuse|7fff00,chocolate|d2691e,coral|ff7f50,cornflowerblue|6495ed,cornsilk|fff8dc,crimson|dc143c,cyan|00ffff,darkblue|00008b,darkcyan|008b8b,darkgoldenrod|b8860b,darkgray|a9a9a9,darkgreen|006400,darkgrey|a9a9a9,darkkhaki|bdb76b,darkmagenta|8b008b,darkolivegreen|556b2f,darkorange|ff8c00,darkorchid|9932cc,darkred|8b0000,darksalmon|e9967a,darkseagreen|8fbc8f,darkslateblue|483d8b,darkslategray|2f4f4f,darkslategrey|2f4f4f,darkturquoise|00ced1,darkviolet|9400d3,deeppink|ff1493,deepskyblue|00bfff,dimgray|696969,dimgrey|696969,dodgerblue|1e90ff,firebrick|b22222,floralwhite|fffaf0,forestgreen|228b22,fuchsia|ff00ff,gainsboro|dcdcdc,ghostwhite|f8f8ff,gold|ffd700,goldenrod|daa520,gray|808080,green|008000,greenyellow|adff2f,grey|808080,honeydew|f0fff0,hotpink|ff69b4,indianred|cd5c5c,indigo|4b0082,ivory|fffff0,khaki|f0e68c,lavender|e6e6fa,lavenderblush|fff0f5,lawngreen|7cfc00,lemonchiffon|fffacd,lightblue|add8e6,lightcoral|f08080,lightcyan|e0ffff,lightgoldenrodyellow|fafad2,lightgray|d3d3d3,lightgreen|90ee90,lightgrey|d3d3d3,lightpink|ffb6c1,lightsalmon|ffa07a,lightseagreen|20b2aa,lightskyblue|87cefa,lightslategray|778899,lightslategrey|778899,lightsteelblue|b0c4de,lightyellow|ffffe0,lime|00ff00,limegreen|32cd32,linen|faf0e6,magenta|ff00ff,maroon|800000,mediumaquamarine|66cdaa,mediumblue|0000cd,mediumorchid|ba55d3,mediumpurple|9370db,mediumseagreen|3cb371,mediumslateblue|7b68ee,mediumspringgreen|00fa9a,mediumturquoise|48d1cc,mediumvioletred|c71585,midnightblue|191970,mintcream|f5fffa,mistyrose|ffe4e1,moccasin|ffe4b5,navajowhite|ffdead,navy|000080,oldlace|fdf5e6,olive|808000,olivedrab|6b8e23,orange|ffa500,orangered|ff4500,orchid|da70d6,palegoldenrod|eee8aa,palegreen|98fb98,paleturquoise|afeeee,palevioletred|db7093,papayawhip|ffefd5,peachpuff|ffdab9,peru|cd853f,pink|ffc0cb,plum|dda0dd,powderblue|b0e0e6,purple|800080,rebeccapurple|663399,red|ff0000,rosybrown|bc8f8f,royalblue|4169e1,saddlebrown|8b4513,salmon|fa8072,sandybrown|f4a460,seagreen|2e8b57,seashell|fff5ee,sienna|a0522d,silver|c0c0c0,skyblue|87ceeb,slateblue|6a5acd,slategray|708090,slategrey|708090,snow|fffafa,springgreen|00ff7f,steelblue|4682b4,tan|d2b48c,teal|008080,thistle|d8bfd8,tomato|ff6347,turquoise|40e0d0,violet|ee82ee,wheat|f5deb3,white|ffffff,whitesmoke|f5f5f5,yellow|ffff00,yellowgreen|9acd32';

var colorMap = (function() {

    var map;

    var parse = function() {
        var obj = {},
            list = NAMED_COLORS.split(',');

        var idx = 0, length = list.length;
        for (; idx < length; idx++) {
            var entry = list[idx],
                pair = entry.split('|'),
                key = pair[0],
                value = '#' + pair[1];
            obj[key] = value;
        }

        return obj;
    };

    return function() {
        return map ? map : (map = parse());
    };

}());

var normalizeName = (function() {
    var cache = {};

    var normalize = function(str) {
        return (str || '').toLowerCase().replace(/\s/g, '');
    };

    return function(str) {
        return cache[str] || (cache[str] = normalize(str));
    };
}());

module.exports = {
    lookup: function(name) {
        return colorMap()[normalizeName(name)];
    }
};
},{}],13:[function(require,module,exports){
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

},{"./color-converter":11,"./named-colors":12,"./utils":16}],14:[function(require,module,exports){
module.exports = function(rgb) {
    return 'rgb('+ rgb[0] +', '+ rgb[1] +', '+ rgb[2] +')';
};
},{}],15:[function(require,module,exports){
var $ = window.$,

    SWATCH = '<div class="hsl-swatch"></div>';

module.exports = function() {
    return $(SWATCH);
};
},{}],16:[function(require,module,exports){
var toString = ({}).toString;

var keys = Object.keys || function(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(key);
    }
    return arr;
};

module.exports = {
    isString: function(obj) {
        return toString.call(obj) === '[object String]';
    },

    isArray: Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    },

    isNumber: function(obj) {
        return toString.call(obj) === '[object Number]';
    },

    each: function(obj, iteratee) {
        if (!obj) { return obj; }

        var length = obj.length;
        if (length === +length) {
            for (var idx = 0; idx < length; idx++) {
                if (iteratee(obj[idx], idx, obj) === false) { break; }
            }
        } else {
            for (var key in obj) {
                if (iteratee(obj[key], key, obj) === false) { break; }
            }
        }

        return obj;
    },

    reduce: function(obj, iteratee, memo) {
        if (!obj) { obj = []; }

        var keys = obj.length !== +obj.length && keys(obj),
            length = (keys || obj).length,
            index = 0, currentKey;
        if (arguments.length < 3) {
            if (!length) { return memo; }
            memo = obj[keys ? keys[index++] : index++];
        }
        for (; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }

        return memo;
    }
};
},{}]},{},[1])


//# sourceMappingURL=jquery.hsl-picker.js.map