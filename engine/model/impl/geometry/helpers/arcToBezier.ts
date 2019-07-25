
// translated to ts from https://github.com/colinmeinke/svg-arc-to-cubic-bezier/blob/master/src/index.js


const TAU:number = Math.PI * 2;

interface IXY {
    x:number;
    y:number;
}

const mapToEllipse = ({ x, y }:IXY, rx:number, ry:number, cosphi:number, sinphi:number, centerx:number, centery:number):IXY => {
    x *= rx;
    y *= ry;

    const xp:number = cosphi * x - sinphi * y;
    const yp:number = sinphi * x + cosphi * y;

    return {
        x: xp + centerx,
        y: yp + centery
    };
};

const approxUnitArc = (ang1:number, ang2:number):[IXY,IXY,IXY] => {
    // See http://spencermortensen.com/articles/bezier-circle/ for the derivation
    // of this constant.
    // Note: We need to keep the sign of ang2, because this determines the
    //       direction of the arc using the sweep-flag parameter.
    const c:number = 0.551915024494 * (ang2 < 0 ? -1 : 1);

    const x1:number = Math.cos(ang1);
    const y1:number = Math.sin(ang1);
    const x2:number = Math.cos(ang1 + ang2);
    const y2:number = Math.sin(ang1 + ang2);

    return [
        {
            x: x1 - y1 * c,
            y: y1 + x1 * c
        },
        {
            x: x2 + y2 * c,
            y: y2 - x2 * c
        },
        {
            x: x2,
            y: y2
        }
    ];
};

const vectorAngle = (ux:number, uy:number, vx:number, vy:number):number => {
    const sign:number = (ux * vy - uy * vx < 0) ? -1 : 1;
    const umag:number = Math.sqrt(ux * ux + uy * uy);
    const vmag:number = Math.sqrt(ux * ux + uy * uy);
    const dot:number = ux * vx + uy * vy;

    let div:number = dot / (umag * vmag);

    if (div > 1) {
        div = 1;
    }

    if (div < -1) {
        div = -1;
    }

    return sign * Math.acos(div);
};

const getArcCenter = (
    px:number,
    py:number,
    cx:number,
    cy:number,
    rx:number,
    ry:number,
    largeArcFlag:0|1,
    sweepFlag:0|1,
    sinphi:number,
    cosphi:number,
    pxp:number,
    pyp:number
):[number,number,number,number] => {
    const rxsq:number = Math.pow(rx, 2);
    const rysq:number = Math.pow(ry, 2);
    const pxpsq:number = Math.pow(pxp, 2);
    const pypsq:number = Math.pow(pyp, 2);

    let radicant:number = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);

    if (radicant < 0) {
        radicant = 0;
    }

    radicant /= (rxsq * pypsq) + (rysq * pxpsq);
    radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);

    const centerxp:number = radicant * rx / ry * pyp;
    const centeryp:number = radicant * -ry / rx * pxp;

    const centerx:number = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
    const centery:number = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;

    const vx1:number = (pxp - centerxp) / rx;
    const vy1:number = (pyp - centeryp) / ry;
    const vx2:number = (-pxp - centerxp) / rx;
    const vy2:number = (-pyp - centeryp) / ry;

    const ang1:number = vectorAngle(1, 0, vx1, vy1);
    let ang2:number = vectorAngle(vx1, vy1, vx2, vy2);

    if (sweepFlag === 0 && ang2 > 0) {
        ang2 -= TAU;
    }

    if (sweepFlag === 1 && ang2 < 0) {
        ang2 += TAU;
    }

    return [ centerx, centery, ang1, ang2 ];
};

export const arcToBezier = (
                         px:number,
                         py:number,
                         cx:number,
                         cy:number,
                         rx:number,
                         ry:number,
                         xAxisRotation:number = 0,
                         largeArcFlag:0|1 = 0,
                         sweepFlag:0|1 = 0
                     ):{ x1:number, y1:number, x2:number, y2:number, x:number, y:number}[]|null => {
    const curves = [];

    if (rx === 0 || ry === 0) {
        return null;
    }

    const sinphi = Math.sin(xAxisRotation * TAU / 360);
    const cosphi = Math.cos(xAxisRotation * TAU / 360);

    const pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
    const pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;

    if (pxp === 0 && pyp === 0) {
        return null;
    }

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    const lambda =
        Math.pow(pxp, 2) / Math.pow(rx, 2) +
        Math.pow(pyp, 2) / Math.pow(ry, 2);

    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }

    let centerx: number, centery: number, ang1: number, ang2: number;
    [centerx, centery, ang1, ang2] = getArcCenter(
        px,
        py,
        cx,
        cy,
        rx,
        ry,
        largeArcFlag,
        sweepFlag,
        sinphi,
        cosphi,
        pxp,
        pyp
    );

    // If 'ang2' == 90.0000000001, then `ratio` will evaluate to
    // 1.0000000001. This causes `segments` to be greater than one, which is an
    // unecessary split, and adds extra points to the bezier curve. To alleviate
    // this issue, we round to 1.0 when the ratio is close to 1.0.
    let ratio:number = Math.abs(ang2) / (TAU / 4);
    if (Math.abs(1.0 - ratio) < 0.0000001) {
        ratio = 1.0;
    }

    const segments:number = Math.max(Math.ceil(ratio), 1);

    ang2 /= segments;

    for (let i = 0; i < segments; i++) {
        curves.push(approxUnitArc(ang1, ang2));
        ang1 += ang2;
    }

    return curves.map((curve:[IXY,IXY,IXY]) => {
        const { x: x1, y: y1 } = mapToEllipse(curve[ 0 ], rx, ry, cosphi, sinphi, centerx, centery);
        const { x: x2, y: y2 } = mapToEllipse(curve[ 1 ], rx, ry, cosphi, sinphi, centerx, centery);
        const { x, y } = mapToEllipse(curve[ 2 ], rx, ry, cosphi, sinphi, centerx, centery);

        return { x, y, x1, y1, x2, y2};
    });
};