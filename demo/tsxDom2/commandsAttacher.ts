import {Widget} from "./widget";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";
import {Texture} from "@engine/renderer/webGl/base/texture";

const wait = async (time:number)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,time);
    });
}

export class CommandsAttacher {
    constructor(private widget:Widget,private canvas:DrawingSurface) {
    }

    private attachCommonCommands() {
        const print = (...args:string[]|number[])=>{
            this.widget.print(...args);
        }

        const input = (prompt:string)=>{
            const literal = this.widget.input(prompt);
            if (Number.isFinite(+literal)) return +literal;
            else return literal;
        }

        const catchError = (e:any):void=>{
            this.widget.catchError(e);
        }

        const clearScreen = ():void=>{
            this.widget.clearScreen();
        }

        return {
            print,
            input,
            catchError,
            clearScreen
        };
    }

    private attachGraphicsCommands() {
        const drawPoint = (x:number,y:number,col:string)=>{
            this.canvas.setDrawColor(Color.fromCssLiteral(col));
            this.canvas.drawRect(x,y,1,1);
        }
        const drawLine = async (x0:number, y0:number, x1:number, y1:number,color:string) => {
            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = (x0 < x1) ? 1 : -1;
            const sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;

            // eslint-disable-next-line no-constant-condition
            while(true) {
                await wait(1)
                drawPoint(x0, y0,color);

                if ((x0 === x1) && (y0 === y1)) break;
                const e2 = 2*err;
                if (e2 > -dy) { err -= dy; x0  += sx; }
                if (e2 < dx) { err += dx; y0  += sy; }
            }
        }

        const _drawCircle = (xc:number, yc:number,x :number,y:number,color:string)=>{
            drawPoint(xc+x, yc+y, color);
            drawPoint(xc-x, yc+y, color);
            drawPoint(xc+x, yc-y, color);
            drawPoint(xc-x, yc-y, color);
            drawPoint(xc+y, yc+x, color);
            drawPoint(xc-y, yc+x, color);
            drawPoint(xc+y, yc-x, color);
            drawPoint(xc-y, yc-x, color);
        }

        const drawCircle = async (xc:number,yc:number,r:number,color:string)=>{
            let x = 0, y = r;
            let d = 3 - 2 * r;
            _drawCircle(xc, yc, x, y, color);
            while (y >= x) {
                // for each pixel we will
                // draw all eight pixels

                x++;

                // check for decision parameter
                // and correspondingly
                // update d, x, y
                if (d > 0) {
                    y--;
                    d = d + 4 * (x - y) + 10;
                }
                else {
                    d = d + 4 * x + 6;
                }
                _drawCircle(xc, yc, x, y, color);
                await wait(1);
            }
        }


        return {
            drawPoint,drawLine,drawCircle
        }
    }

    public init() {
        return {...this.attachCommonCommands(),...this.attachGraphicsCommands()}
    }

}
