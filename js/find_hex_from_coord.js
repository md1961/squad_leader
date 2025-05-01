function findHexFromCoord(x, y) {
    const alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let col1, col2;

    for (let i = 1; i < alphas.length; i++) {
        const prevX = xCoord(alphas[i - 1] + "1");
        const currX = xCoord(alphas[i] + "1");

        if (prevX && currX && x < currX) {
            col1 = alphas[i - 1];
            col2 = alphas[i];
            break;
        } else if (prevX && !currX) {
            col1 = alphas[i - 1];
            col2 = null;
            break;
        }
    }

    const colCandidates = [col1, col2].filter(Boolean);

    for (const col of colCandidates) {
        for (let row = 1; row <= numRows + 1; row++) {
            const hexName = col + row;
            const [cx, cy] = coord(hexName);
            if (!(cx && cy)) continue;

            const h = rowHeight / 2;
            if (isPointInHex(x, y, cx, cy, h)) {
                return hexName;
            }
        }
    }

    return null;
}

// 正六角形の内部判定、h は正六角形の高さの半分
function isPointInHex(x, y, x0, y0, h) {
    const a = h / Math.sqrt(3); // 長方形部分の横幅の半分

    const dx = Math.abs(x - x0);
    const dy = Math.abs(y - y0);

    if (dy >= h || dx >= a * 2) return false;
    if (dx < a) return true;

    return dy < -dx * Math.sqrt(3) + h * 2;
}
