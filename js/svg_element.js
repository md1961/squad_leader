class BaseElement {
    constructor(tag, attrs = {}, children = [], namespace = null) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = [].concat(children);
        this.namespace = namespace;
    }

    toString() {
        const attrsString = Object.entries(this.attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");
        const childrenString = this.children.map(child =>
            child instanceof BaseElement ? child.toString() : child
        ).join("");
        return `<${this.tag}${attrsString ? " " + attrsString : ""}>${childrenString}</${this.tag}>`;
    }

    toDOM() {
        const el = this.namespace ? document.createElementNS(this.namespace, this.tag)
                                  : document.createElement(this.tag);
        for (const [k, v] of Object.entries(this.attrs)) {
            el.setAttribute(k, v.toString());
        }
        for (const child of this.children) {
            el.appendChild(
                child instanceof BaseElement ? child.toDOM()
                                                  : document.createTextNode(child)
            );
        }
        return el;
    }
}

class SvgElement extends BaseElement {
    constructor(tag, attrs = {}, children = []) {
        super(tag, attrs, children, "http://www.w3.org/2000/svg");
    }
}

class HtmlElement extends BaseElement {
    constructor(tag, attrs = {}, children = []) {
        super(tag, attrs, children, "http://www.w3.org/1999/xhtml");
    }
}

class ForeignObject {
    constructor(content, x, y) {
        this.content = content;
        this.x = x;
        this.y = y;
    }

    toDOM() {
        const div = new HtmlElement('div', {xmlns: "http://www.w3.org/1999/xhtml"}, this.content);
        const el = new SvgElement('foreignObject', {x: this.x, y: this.y, width: 200, height: 100}, div);
        return el.toDOM();
    }
}

class Unit {
    constructor(content, x, y) {
        this.content = content;
        this.x = x;
        this.y = y;
    }

    toDOM() {
        const span = new HtmlElement('span', {'class': 'foreign-content'}, this.content);
        const el = new ForeignObject(span, this.x, this.y);
        return el.toDOM();
    }
}

// 上下の辺が水平な正六角形
class SvgHex {
    // height はヘクスの高さ(全高)
    constructor(cx, cy, height, options = {}) {
        const defaultOptions = {stroke: 'black', fill: 'none'};

        let opts = {...options};  // copy options
        if ('points' in opts) delete opts.points;
        opts = {...defaultOptions, ...opts};

        const r = height / Math.sqrt(3);
        const h = height / 2;
        const points = [
            [cx + r  , cy    ],
            [cx + r/2, cy + h],
            [cx - r/2, cy + h],
            [cx - r  , cy    ],
            [cx - r/2, cy - h],
            [cx + r/2, cy - h]
        ];

        const attrPoints = points.map(p => p.join(",")).join(" ");
        const attributes = {...{points: attrPoints}, ...opts};

        this.svgPolygon = new SvgElement('polygon', attributes);
    }

    toDOM() {
        return this.svgPolygon.toDOM();
    }
}
