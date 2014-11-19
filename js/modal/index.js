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