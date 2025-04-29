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
