var $              = window.$,
    _              = require('./utils'),

    Modal          = require('./Modal'),
    swatch         = require('./swatch'),
    optionsParser  = require('./options-parser'),
    rgbToString    = require('./rgb-to-string'),
    colorConverter = require('./color-converter'),

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
    this.input.after(this.modal.elem);
    this.modal.init(this.opts);

    this._bindSwatch();
    this._bindModal();
    this._bindInput();
    this.refresh();

    if (this.opts.disabled || this.input.is(':disabled')) { this.disable(); }
    if (this.opts.alwaysOpen) { this.modal.alwaysOpen(); }

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
