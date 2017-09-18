const assert = require("assert");
const s = require("./index.js");

describe(`SVGMaker`, function(){
	it(`Element`, function(){
		const el = s.e("rect", {fill: "black"});
		assert.strictEqual(el.toString(), `<rect fill="black"></rect>`);
		el.children.push(s.e("circle", {rx: 5, ry: 8}));
		assert(el.toString().indexOf(`<circle rx="5" ry="8"></circle>`) > 0);
	});
	it(`SelfClosingElement`, function(){
		const el = s.sce("animate", {fill: "black"});
		assert.strictEqual(el.toString(), `<animate fill="black"/>`);
	});
	it(`TextElement`, function(){
		const el = s.texte("style", {fill: "black"}, "body{padding:0;}");
		assert.strictEqual(el.toString(), `<style fill="black">body{padding:0;}</style>`);
		const elb = s.texte("style", {fill: "black"});
		assert.strictEqual(elb.toString(), `<style fill="black"></style>`);
	});
});