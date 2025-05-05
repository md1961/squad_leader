// ビューポートの座標をSVGの座標系に変換
function transformViewPortCoordToSVG(x, y, svg) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    return [svgP.x, svgP.y];
}
