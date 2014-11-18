var supportsCSS3Gradients = require('./supports-css3-gradients'),
    css3Grad = require('./css3-grad'),
    svgGrad = require('./svg-grad');

module.exports = supportsCSS3Gradients ? css3Grad : svgGrad;