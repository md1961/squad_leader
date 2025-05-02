class SvgElement {
    constructor(tag, attrs = {}, children = []) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
    }

    setAttr(name, value) {
        this.attrs[name] = value;
        return this;
    }

    append(child) {
        this.children.push(child);
        return this;
    }

    toString() {
        const attrsString = Object.entries(this.attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");
        const childrenString = this.children.map(child =>
            child instanceof this.constructor ? child.toString() : child
        ).join("");
        return `<${this.tag}${attrsString ? " " + attrsString : ""}>${childrenString}</${this.tag}>`;
    }

    toDOM() {
        const el = document.createElementNS("http://www.w3.org/2000/svg", this.tag);
        for (const [k, v] of Object.entries(this.attrs)) {
            el.setAttribute(k, v);
        }
        for (const child of this.children) {
            el.appendChild(
                child instanceof this.constructor
                ? child.toDOM()
                : document.createTextNode(child)
            );
        }
        return el;
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
