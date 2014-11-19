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