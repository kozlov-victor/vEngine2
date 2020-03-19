

// by https://www.particleincell.com/wp-content/uploads/2012/06/circles.svg

import {IPoint2d} from "@engine/geometry/point2d";
import {MathEx} from "@engine/misc/mathEx";

export const createSplinePathFromPoints = (points:number[]):string=> {
    /*grab (x,y) coordinates of the control points*/
    const x:number[]=[];
    const y:number[]=[];
    let cnt:number = 0;
    for (let i:number=0;i<points.length;i=i+2) {
        x[cnt]=points[i];
        y[cnt]=points[i+1];
        cnt++;
    }

    /*computes control points p1 and p2 for x and y direction*/
    const px:{p1:number[],p2:number[]} = computeControlPoints(x);
    const py:{p1:number[],p2:number[]} = computeControlPoints(y);

    /*updates path settings, the browser will draw the new spline*/
    const numOfPoints:number = points.length/2;
    let pathStr:string = '';
    for (let i:number=0;i<numOfPoints - 1;i++) {
        pathStr+= path(i,x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]);
    }
    return pathStr;
};


/*creates formated path string for SVG cubic path element*/
const path = (i:number,x1:number,y1:number,px1:number,py1:number,px2:number,py2:number,x2:number,y2:number):string=> {
    let res:string = '';
    if (i===0) res +=`M ${x1} ${y1} `;
    res+=` C ${px1} ${py1} ${px2} ${py2} ${x2} ${y2}`;
    return res;
};

/*computes control points given knots K, this is the brain of the operation*/
const computeControlPoints = (K:number[]):{p1:number[],p2:number[]}=>{
    const p1:number[]=[];
    const p2:number[]=[];
    const n:number = K.length-1;

    /*rhs vector*/
    const a:number[]=[];
    const b:number[]=[];
    const c:number[]=[];
    const r:number[]=[];

    /*left most segment*/
    a[0]=0;
    b[0]=2;
    c[0]=1;
    r[0] = K[0]+2*K[1];

    /*internal segments*/
    for (let i:number = 1; i < n - 1; i++) {
        a[i]=1;
        b[i]=4;
        c[i]=1;
        r[i] = 4 * K[i] + 2 * K[i+1];
    }

    /*right segment*/
    a[n-1]=2;
    b[n-1]=7;
    c[n-1]=0;
    r[n-1] = 8*K[n-1]+K[n];

    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (let i:number = 1; i < n; i++) {
        const m:number = a[i]/b[i-1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m*r[i-1];
    }

    p1[n-1] = r[n-1]/b[n-1];
    for (let i:number = n - 2; i >= 0; --i) {
        p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
    }


    /*we have p1, now compute p2*/
    for (let i:number=0;i<n-1;i++) {
        p2[i]=2*K[i+1]-p1[i+1];
    }

    p2[n-1]=0.5*(K[n]+p1[n-1]);

    return {p1, p2};
};

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

const polarToCartesian=(centerX:number, centerY:number, radius:number, angle:number):IPoint2d=> {

    return {
        x: centerX + (radius * Math.cos(angle)),
        y: centerY + (radius * Math.sin(angle))
    };
};

export const describeArc = (x:number, y:number, radius:number, startAngle:number, endAngle:number,anticlockwise:boolean = false):string=>{

    const start:IPoint2d = polarToCartesian(x, y, radius, endAngle);
    const end:IPoint2d = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};
