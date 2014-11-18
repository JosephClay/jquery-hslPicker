var $ = window.$,

    div = document.createElement('div'),

    prefixes = ['-webkit-', ''],

    gradients = $.map(prefixes, function(prefix) {
        return 'background-image:' + prefix + 'linear-gradient(left top,#9f9, white);';
    }).join(' ');

div.setAttribute('style', gradients);

module.exports = !!div.style.backgroundImage;

div = null;