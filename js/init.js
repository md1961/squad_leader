const hexNameTopLeft     = "B1";
const hexNameBottomRight = "Q10";
const coordTopLeft        = Object.freeze([57, 65]);
const offsetToBottomRight = Object.freeze([843 - 1, 548 - 1]);
const isLowerOnLeftmostColumn = true;

function assertHexName(hexName) {
    const match = /^[A-Z]\d{1,2}$/.test(hexName);
    if (!match) {
        throw new Error(`Illegal hexName '${hexName}'`);
    }
}

function columnIndexOf(hexName) {
    assertHexName(hexName);

    return hexName.charCodeAt(0) - hexNameTopLeft.charCodeAt(0);
}

function rowNumberOf(hexName) {
    assertHexName(hexName);

    const match = hexName.match(/\d+$/);
    return parseInt(match[0], 10);
}

const numColumns = columnIndexOf(hexNameBottomRight) + 1;
const xCoordsColumn = Array.from({length: numColumns},
                                 (_, i) => coordTopLeft[0] + offsetToBottomRight[0] * i / (numColumns - 1));

function xCoord(hexName) {
    return xCoordsColumn[columnIndexOf(hexName)];
}

function isLower(hexName) {
    return columnIndexOf(hexName) % 2 === (isLowerOnLeftmostColumn ? 0 : 1);
}
