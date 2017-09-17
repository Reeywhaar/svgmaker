function wrap(symbol, str){
	return `${symbol}${str}${symbol}`
}

function indent(str){
	return str.replace(/^/gm, "\t");
}

function pipe(obj, ...fns){
	return fns.reduce((c, fn)=>{
		return fn(c);
	}, obj)
};

function cl(x){
	console.log(x);
	return x;
}

class BaseElement{
	constructor(tag, attrs){
		this.tag = tag;
		this.attrs = attrs;
	}
}

class Element extends BaseElement{
	constructor(tag, attrs, children = []){
		super(tag, attrs);
		this.children = children;
	}

	toString(){
		let children = "";
		if(this.children.length > 0){
			children = pipe(
				this.children.map(x => x.toString()).join("\n"),
				x => indent(x),
				x => wrap("\n", x),
			);
		};
		return `<${this.tag} ${Object.entries(this.attrs).map(([key, value]) => `${key}="${value}"`).join(" ")}>${children}</${this.tag}>`
	}
}

exports.Element = Element;

exports.e = function(tag, attrs, children = []){
	return new Element(tag, attrs, children);
}

class SelfClosingElement extends BaseElement{
	constructor(tag, attrs){
		super(tag, attrs);
	}

	toString(){
		return `<${this.tag} ${Object.entries(this.attrs).map(([key, value]) => `${key}="${value}"`).join(" ")}/>`
	}
}

exports.SelfClosingElement = SelfClosingElement;

exports.sce = function(tag, attrs){
	return new Element(tag, attrs);
}

class SVG{
	constructor(width, height, attrs = {}, children = []){
		this.width = width;
		this.height = height;
		this.attrs = attrs;
		this.children = children;
	}

	toString(){
		return (new Element(
			"svg",
			{
				xmlns:"http://www.w3.org/2000/svg",
				version:"1.1",
				viewBox:`0 0 ${this.width} ${this.height}`,
				width:this.width,
				height:this.height,
				...this.attrs,
			},
			this.children,
		)).toString();
	}
}

exports.SVG = SVG;

exports.svg = function(width, height, attrs = {}, children = []){
	return new SVG(width, height, attrs, children);
};

class SVGFile{
	constructor(width, height, attrs = {}, children = []){
		this.width = width;
		this.height = height;
		this.attrs = attrs;
		this.children = children;
	}

	toString(){
		return `<?xml version="1.0" encoding="UTF-8" ?>\n${new SVG(this.width, this.height, this.attrs, this.children)}`;
	}
}

exports.SVGFile = SVGFile;

exports.svgFile = function(width, height, attrs = {}, children = []){
	return new SVGFile(width, height, attrs, children);
};
