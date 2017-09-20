// To use it must be configured in webpack, because it doesn't ships as separate package
// add to webpack config.js
// resolveLoader: {
// 	alias: {
// 		'svg-js-loader': @reeywhaar/svgmaker/loader.js',
// 	}
// },

const svgmaker = require("./index.js");

module.exports = function SVGLoader(source) {
	if(this.cacheable) this.cacheable();
	if(this.resourcePath in require.cache){
		delete require.cache[this.resourcePath];
	}
	const svg = require(this.resourcePath).toString() + "\n";
	this.value = svg;
	return `module.exports = \`${svg}\``;
}