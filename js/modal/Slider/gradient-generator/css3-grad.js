module.exports = function(colors) {
    var baseColor = colors[0],
        gradients = colors.join(', ');

    return 'background-color: '+ baseColor +'; ' +
            'background-image: -webkit-linear-gradient(left, '+ gradients +'); ' + // Chrome 10-25, iOS 5+, Safari 5.1+
            'background-image: linear-gradient(to right, '+ gradients +');'; // Chrome 26, Firefox 16+, IE 10+, Opera
};