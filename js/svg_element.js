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

class SvgHex {
    constructor(cx, cy, height) {
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
        this.svgPolygon = new SvgElement('polygon', {points: attrPoints, stroke: 'red', fill: 'none'});
    }

    toDOM() {
        return this.svgPolygon.toDOM();
    }
}
