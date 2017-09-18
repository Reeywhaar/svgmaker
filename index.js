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

function format(str, ...replacements){
	return str.replace(/\{\}/g, x => replacements.shift());
}

function cl(x){
	console.log(x);
	return x;
}

function attrsToXML(attrs){
	return Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(" ");
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
		return `<${this.tag} ${attrsToXML(this.attrs)}>${children}</${this.tag}>`
	}
}

exports.Element = Element;
exports.e = (tag, attrs, children = []) => new Element(tag, attrs, children);

class TextElement extends BaseElement{
	constructor(tag, attrs, content = null){
		super(tag, attrs);
		this.content = content;
	}

	toString(){
		if(!this.content) this.content = "";
		return `<${this.tag} ${attrsToXML(this.attrs)}>${this.content}</${this.tag}>`
	}
}

exports.TextElement = TextElement;
exports.texte = (tag, attrs, content = null) => new TextElement(tag, attrs, content);

class RoundedRectangle{
	constructor(x, y, width, height, topleftd, toprightd, bottomrightd, bottomleftd, attrs = {}, children=[]){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.topleftd = topleftd;
		this.toprightd = toprightd;
		this.bottomrightd = bottomrightd;
		this.bottomleftd = bottomleftd;
		this.attrs = attrs;
		this.children = children;
	}

	toString(){
		return (new Element(
			"path",
			{
				d: format(
					"\n\tm{} {} h{} q{} {}, {} {}\n\tv{} q{} {}, {} {}\n\th{} q{} {}, {} {}\n\tv{} q{} {}, {} {} z\n",
					/* m */this.x+this.topleftd, this.y,
					/* h */this.width - this.topleftd - this.toprightd,
					/* q */this.toprightd, 0, this.toprightd, this.toprightd,
					/* v */this.height - this.toprightd - this.bottomrightd,
					/* q */0, this.bottomrightd, -this.bottomrightd, this.bottomrightd,
					/* h */-(this.width - this.bottomleftd - this.bottomrightd),
					/* q */-this.bottomleftd, 0, -this.bottomleftd, -this.bottomleftd,
					/* v */-(this.height - this.topleftd - this.bottomleftd),
					/* q */0, -this.topleftd, this.topleftd, -this.topleftd,
				),
				...this.attrs,
			},
			this.children,
		)).toString();
	}
}

exports.RoundedRectangle = RoundedRectangle;
exports.rrect = (x, y, width, hight, topleftd, toprightd, bottomrightd, bottomleftd, attrs = {}, children=[]) => new RoundedRectangle(x, y, width, hight, topleftd, toprightd, bottomrightd, bottomleftd, attrs, children);

class SelfClosingElement extends BaseElement{
	constructor(tag, attrs){
		super(tag, attrs);
	}

	toString(){
		return `<${this.tag} ${Object.entries(this.attrs).map(([key, value]) => `${key}="${value}"`).join(" ")}/>`
	}
}

exports.SelfClosingElement = SelfClosingElement;
exports.sce = (tag, attrs) => new SelfClosingElement(tag, attrs);

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
exports.svg = (width, height, attrs = {}, children = []) => new SVG(width, height, attrs, children);

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
exports.svgFile = (width, height, attrs = {}, children = []) => new SVGFile(width, height, attrs, children);
