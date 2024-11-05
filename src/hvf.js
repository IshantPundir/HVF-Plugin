const { parse } = require('svg-parser');
import { svgPathProperties } from "svg-path-properties";

export async function node_to_svg(node) {
    let svg = (await node.exportAsync({ format: 'SVG_STRING' }));
    return parse(svg);
  }

function polygonArea(polygon) {
    var i = -1;
    var n = polygon.length;
    var a, b = polygon[n - 1];
    var area2 = 0;
    
    while (++i < n) {
      a = b;
      b = polygon[i];
      area2 += a[1] * b[0] - a[0] * b[1];
    }
    return area2 / 2;
  }
  
export function normalize(polygon) {
    // Calculate area of polygon
    let area = polygonArea(polygon);    
    // Make ring clockwise
    if (area > 0) {
        polygon.reverse();
    }

    return polygon
}

export function d_to_ring(d, maxSegmentLength) {
    let ring = [];
    const d_properties = new svgPathProperties(d.toString());
    const d_len = d_properties.getTotalLength();
    
    // Calculating number of points to add in path
    let numPoints = Math.max(3, Math.ceil(d_len/maxSegmentLength));
    // numPoints = Math.ceil(d_len/maxSegmentLength);
    for (let i=0; i < numPoints; i++) {
      let p = d_properties.getPointAtLength((d_len * i) / numPoints);
      ring.push([p.x, p.y]);
    }
  
    return ring;
  }