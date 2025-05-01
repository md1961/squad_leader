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

const numRows = rowNumberOf(hexNameBottomRight) - 1;
const rowHeight = offsetToBottomRight[1]
                  / (
                      numRows
                      + ( isLower(hexNameTopLeft) && !isLower(hexNameBottomRight) ? -0.5 : 0)
                      + (!isLower(hexNameTopLeft) &&  isLower(hexNameBottomRight) ?  0.5 : 0)
                  );
const yCoordsLowerRow = Array.from({length: numRows + 1},
                        (_, i) => coordTopLeft[1] + rowHeight * i + (isLowerOnLeftmostColumn ? 0 : rowHeight / 2));

function yCoord(hexName) {
    return yCoordsLowerRow[rowNumberOf(hexName) - 1] - (isLower(hexName) ? 0 : rowHeight / 2);
}

function coord(hexName) {
    return [xCoord(hexName), yCoord(hexName)];
}
