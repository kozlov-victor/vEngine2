import {Scene} from "@engine/scene/scene";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Color} from "@engine/renderer/common/color";


export class MainScene extends Scene {


    // https://gamesnacks.com/embed/static/media/powered_by.855b1bc9.svg
    // todo does not works
    public onReady() {
        const svgPath:string = `
           M 0.87 20.08 V 1.38 h 6.92 c 1.5 0 2.73 0.25 3.71 0.75 s 1.71 1.18 2.2 2.06 c 0.47 0.87 0.71 1.85 0.71 2.93 a 6 6 0 0 1 -0.7 2.86 a 5.2 5.2 0 0 1 -2.16 2.09 c -0.97 0.51 -2.23 0.77 -3.76 0.77 h -3.5 v 7.24 H 0.87 Z m 3.42 -10.02 h 3.28 c 1.2 0 2.05 -0.26 2.57 -0.77 c 0.53 -0.54 0.8 -1.26 0.8 -2.17 c 0 -0.92 -0.27 -1.64 -0.8 -2.16 c -0.52 -0.53 -1.37 -0.8 -2.57 -0.8 H 4.3 v 5.9 Z m 18.4 10.34 a 6.63 6.63 0 0 1 -5.9 -3.31 a 7.32 7.32 0 0 1 -0.88 -3.64 a 7 7 0 0 1 0.9 -3.6 a 6.57 6.57 0 0 1 5.91 -3.34 c 1.27 0 2.4 0.3 3.42 0.88 a 6.32 6.32 0 0 1 2.43 2.46 a 7 7 0 0 1 0.91 3.6 c 0 1.38 -0.3 2.59 -0.9 3.64 a 6.38 6.38 0 0 1 -2.44 2.43 a 6.84 6.84 0 0 1 -3.44 0.88 Z m 0 -2.96 c 0.9 0 1.67 -0.33 2.33 -1 c 0.66 -0.67 0.99 -1.67 0.99 -2.99 c 0 -1.31 -0.33 -2.3 -1 -2.96 a 3.17 3.17 0 0 0 -4.65 0 c -0.63 0.66 -0.95 1.65 -0.95 2.96 c 0 1.32 0.32 2.32 0.96 3 c 0.66 0.66 1.43 0.98 2.33 0.98 Z m 11.97 2.64 L 30.79 6.83 h 3.39 l 2.3 9.54 l 2.67 -9.54 h 3.79 l 2.67 9.54 l 2.33 -9.54 h 3.39 l -3.9 13.25 h -3.55 l -2.84 -9.91 l -2.83 9.91 h -3.55 Z m 24.8 0.32 a 7.23 7.23 0 0 1 -3.56 -0.85 a 6.19 6.19 0 0 1 -2.43 -2.4 a 7.11 7.11 0 0 1 -0.88 -3.59 c 0 -1.37 0.28 -2.59 0.85 -3.66 a 6.33 6.33 0 0 1 2.4 -2.48 c 1.04 -0.6 2.25 -0.91 3.64 -0.91 c 1.3 0 2.45 0.28 3.45 0.85 s 1.77 1.36 2.32 2.35 a 6.41 6.41 0 0 1 0.83 3.9 l -0.03 0.67 H 55.98 a 3.48 3.48 0 0 0 1.07 2.43 c 0.66 0.6 1.45 0.89 2.38 0.89 c 0.7 0 1.27 -0.16 1.73 -0.46 c 0.48 -0.32 0.84 -0.73 1.07 -1.23 h 3.47 a 6.32 6.32 0 0 1 -3.39 3.9 c -0.83 0.4 -1.79 0.59 -2.86 0.59 Z m 0.02 -11.11 a 3.6 3.6 0 0 0 -2.22 0.72 a 3.23 3.23 0 0 0 -1.23 2.14 h 6.6 a 2.88 2.88 0 0 0 -0.96 -2.09 a 3.2 3.2 0 0 0 -2.19 -0.77 Z m 9.5 10.79 V 6.83 h 3.05 l 0.32 2.48 a 5.47 5.47 0 0 1 4.89 -2.8 v 3.6 h -0.97 c -0.74 0 -1.41 0.12 -2 0.35 c -0.59 0.23 -1.05 0.63 -1.39 1.2 a 4.88 4.88 0 0 0 -0.48 2.38 v 6.04 h -3.42 Z m 16.8 0.32 a 7.23 7.23 0 0 1 -3.56 -0.85 a 6.19 6.19 0 0 1 -2.43 -2.4 a 7.11 7.11 0 0 1 -0.88 -3.59 c 0 -1.37 0.29 -2.59 0.86 -3.66 a 6.33 6.33 0 0 1 2.4 -2.48 c 1.03 -0.6 2.24 -0.91 3.63 -0.91 c 1.3 0 2.45 0.28 3.45 0.85 s 1.77 1.36 2.32 2.35 a 6.41 6.41 0 0 1 0.83 3.9 c 0 0.22 0 0.44 -0.03 0.67 H 82.3 a 3.48 3.48 0 0 0 1.07 2.43 c 0.66 0.6 1.45 0.89 2.38 0.89 c 0.7 0 1.27 -0.16 1.74 -0.46 c 0.48 -0.32 0.83 -0.73 1.06 -1.23 h 3.48 a 6.33 6.33 0 0 1 -3.4 3.9 c -0.83 0.4 -1.79 0.59 -2.85 0.59 Z m 0.02 -11.11 a 3.6 3.6 0 0 0 -2.21 0.72 a 3.23 3.23 0 0 0 -1.23 2.14 h 6.6 a 2.88 2.88 0 0 0 -0.97 -2.09 a 3.2 3.2 0 0 0 -2.19 -0.77 Z m 15.6 11.11 a 6.22 6.22 0 0 1 -5.67 -3.4 a 7.39 7.39 0 0 1 -0.85 -3.57 c 0 -1.34 0.28 -2.52 0.85 -3.55 a 6.3 6.3 0 0 1 5.66 -3.37 c 1 0 1.87 0.19 2.62 0.56 c 0.75 0.37 1.36 0.9 1.82 1.58 V 0.85 h 3.42 v 19.23 h -3.05 l -0.37 -1.9 c -0.43 0.6 -1 1.1 -1.71 1.55 c -0.7 0.45 -1.6 0.67 -2.73 0.67 Z m 0.72 -3 c 1.1 0 2 -0.36 2.7 -1.09 a 3.98 3.98 0 0 0 1.06 -2.86 c 0 -1.15 -0.35 -2.1 -1.07 -2.83 a 3.51 3.51 0 0 0 -2.7 -1.12 c -1.08 0 -1.98 0.37 -2.7 1.1 a 3.88 3.88 0 0 0 -1.06 2.83 c 0 1.16 0.36 2.1 1.07 2.86 a 3.57 3.57 0 0 0 2.7 1.12 Z m 24.83 3 c -1 0 -1.87 -0.19 -2.62 -0.56 a 4.72 4.72 0 0 1 -1.81 -1.58 l -0.38 1.82 h -3.05 V 0.85 h 3.42 v 7.88 a 5.12 5.12 0 0 1 4.43 -2.22 a 6.22 6.22 0 0 1 5.67 3.4 c 0.57 1.04 0.86 2.24 0.86 3.57 c 0 1.34 -0.29 2.53 -0.86 3.58 a 6.56 6.56 0 0 1 -2.32 2.46 c -0.98 0.59 -2.1 0.88 -3.34 0.88 Z m -0.72 -3 c 1.08 0 1.98 -0.36 2.7 -1.09 a 3.89 3.89 0 0 0 1.06 -2.83 c 0 -1.16 -0.35 -2.1 -1.06 -2.86 a 3.57 3.57 0 0 0 -2.7 -1.12 a 3.6 3.6 0 0 0 -2.73 1.12 a 3.94 3.94 0 0 0 -1.04 2.83 c 0 1.16 0.35 2.12 1.04 2.86 c 0.72 0.73 1.62 1.1 2.73 1.1 Z m 10.75 8.56 l 3.07 -6.76 h -0.8 l -5.16 -12.37 h 3.72 l 3.7 9.32 l 3.88 -9.32 h 3.64 l -8.42 19.13 h -3.63 Z
        `;
        const p = PolyLine.fromMultiCurveSvgPath(this.game,svgPath);
        p.forEach((it,i)=>{
            it.color = Color.RGB(200,22,12);
            it.lineWidth = 2;
            it.pos.setXY(40,40);
            this.appendChild(it);
        });
    }

}
