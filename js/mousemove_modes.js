function addEventListenersForMouseDragFor(target) {
    let isDragging = false;

    target.addEventListener('mousedown', (e) => {
        isDragging = true;

        mode.handleMouseDown(e);
    });

    target.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        mode.handleMouseMove(e);
    });

    target.addEventListener('mouseup', (e) => {
        isDragging = false;

        mode.handleMouseUp(e);
    });
}

class Mode {
    static isLineOfFire() {
        return document.querySelector('input[name="mode"]:checked')?.value === 'line_of_fire';
    }
}

class MouseHandler {
    handleMouseDown(e) { throw new Error("Must override handleMouseDown"); }
    handleMouseMove(e) { throw new Error("Must override handleMouseMove"); }
    handleMouseUp(e)   { throw new Error("Must override handleMouseUp"); }
}

class ModeUnitMove extends MouseHandler {
    offsetX;
    offsetY;

    constructor(unit) {
        super();

        this.target = unit.closest('foreignObject');
    }

    handleMouseDown(e) {
        this.offsetX = e.clientX - parseFloat(this.target.getAttribute('x'));
        this.offsetY = e.clientY - parseFloat(this.target.getAttribute('y'));
    }

    handleMouseMove(e) {
        this.target.setAttribute('x', e.clientX - this.offsetX);
        this.target.setAttribute('y', e.clientY - this.offsetY);
    }

    handleMouseUp(e) {
    }
}

class ModeLineOfFire extends MouseHandler {
    svg;

    hexName0;
    hexName1;
    svgHex0;

    constructor(svg) {
        super();

        this.svg = svg;
    }

    handleMouseDown(e) {
        this.hexName1 = null;

        const [x, y] = transformViewPortCoordToSVG(e.clientX, e.clientY, this.svg);

        this.hexName0 = findHexFromCoord(x, y);
        if (this.hexName0) {
            const [cx, cy] = coord(this.hexName0);
            const elemHex = new SvgHex(cx, cy, rowHeight, {stroke: 'cyan', 'stroke-width': 3});
            this.svgHex0 = elemHex.toDOM();
            this.svg.appendChild(this.svgHex0);
        }
    }

    handleMouseMove(e) {
        const [x, y] = transformViewPortCoordToSVG(e.clientX, e.clientY, this.svg);
        this.hexName1 = findHexFromCoord(x, y);

        if (this.hexName1 && this.hexName1 != this.hexName0) {
            let lastChild;
            while ((lastChild = this.svg.lastChild) !== this.svgHex0) {
                this.svg.removeChild(lastChild);
            }

            const [cx, cy] = coord(this.hexName1);
            const elemHex = new SvgHex(cx, cy, rowHeight, {stroke: 'red', 'stroke-width': 3});
            this.svg.appendChild(elemHex.toDOM());
        }
    }

    handleMouseUp(e) {
        let lastChild;
        while ((lastChild = this.svg.lastChild) !== this.svgHex0) {
            this.svg.removeChild(lastChild);
        }
        this.svg.removeChild(lastChild);

        if (this.hexName1) {
            const [x1, y1] = coord(this.hexName0);
            const [x2, y2] = coord(this.hexName1);
            const elemLine = new SvgElement('line', {x1, y1, x2, y2, stroke: 'red', class: 'linfOfFire'});
            this.svg.appendChild(elemLine.toDOM());

            this.hexName1 = null;
        } else {
            const elemLinfOfFire = document.querySelector('.linfOfFire');
            if (elemLinfOfFire) {
                elemLinfOfFire.remove();
            }
        }
    }
}
