var $   = window.$,
    doc = $(document),

    gradientGenerator = require('./gradient-generator'),
    rgbToString       = require('../../rgb-to-string'),
    colorConverter    = require('../../color-converter'),

    DISABLED_CLASS = 'hsl-disabled';

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

                self._mousedown(e);
            })
            .on('click tap', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

        this.bar.on('click tap', function(e) {
            if (self.disabled) { return; }

            self._click(e);
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