import {Shape} from "@engine/renderable/abstract/shape";
import {Line} from "@engine/renderable/impl/geometry/line";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {createSplinePathFromPoints} from "@engine/renderable/impl/geometry/_internal/splineFromPoints";
import {clearSvgString} from "@engine/renderable/impl/geometry/_internal/clearSvgString";
import {SvgPathCreator} from "@engine/renderable/impl/geometry/_internal/svgPathCreator";
import {closePolylinePoints} from "@engine/renderable/impl/geometry/_internal/closePolylinePoints";
import {Point2d} from "@engine/geometry/point2d";


export class PolyLine extends Shape {

    public get lineWidth():number{
        return this._lineWidth;
    }

    public set lineWidth(val:number){
        this._lineWidth = val;
        this.passPropertiesChildren();
    }

    public set borderRadius(val:number){
        this._borderRadius = val;
        this.passPropertiesChildren();
    }

    public get borderRadius():number{
        return this._borderRadius;
    }

    constructor(protected game:Game){
        super(game);
        this._lineWidth = 1;
        this.color.addOnChangeListener(()=>this.passPropertiesChildren());
    }

    declare public children:Line[];

    private _borderRadius:number = 1;


    public static fromVertices(game:Game, vertices:number[]|string, close:boolean = false):PolyLine{
        if (typeof vertices === 'string') {
            vertices = clearSvgString(vertices).split(/[ |,]/).map((it:string)=>{
                const n:number = parseFloat(it);
                if (DEBUG && isNaN(n)) throw new DebugError(`can not parse vertex array ${vertices}: unexpected value ${it}`);
                return n;
            });
        }

        if (DEBUG && vertices.length===0) throw new DebugError(`can not create polyline from empty vertex array`);

        if (close) vertices = closePolylinePoints(vertices);

        const pathCreator:SvgPathCreator = new SvgPathCreator(game);
        pathCreator.moveTo(vertices[0],vertices[1]);
        for (let i:number=2;i<vertices.length;i+=2) {
            pathCreator.lineTo(vertices[i],vertices[i+1]);
        }
        return pathCreator.getLastResult();
    }

    public static fromPoints(game:Game,poins:Point2d[],close:boolean = false):PolyLine{
        const vertices:number[] = [];
        poins.forEach(p=>{
            vertices.push(p.x,p.y);
        });
        return this.fromVertices(game,vertices,close);
    }


    public static fromMultiCurveSvgPath(game:Game,path:string, close:boolean = false):PolyLine[]{
        return new SvgPathCreator(game).parsePolylines(path, close);
    }

    // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
    public static fromSvgPath(game:Game,path:string, close:boolean = false):PolyLine {
        const p:PolyLine[] = this.fromMultiCurveSvgPath(game,path,close);
        if (DEBUG && p.length>1) throw new DebugError(`path is multi curve, use fromMultiCurveSvgPath instead`);
        return p[0];
    }

    public static splineFromPoints(game:Game,points:number[],close:boolean = false):PolyLine{
        return PolyLine.fromSvgPath(game,createSplinePathFromPoints(points),close);
    }

    public clone(): PolyLine {
        const l:PolyLine = new PolyLine(this.game);
        this.setClonedProperties(l);
        return l;
    }

    public draw():void{}

    protected setClonedProperties(cloned:PolyLine):void{
        super.setClonedProperties(cloned);
    }

    private passPropertiesChildren():void{
        this.children.forEach(l=>SvgPathCreator.passPropertiesToChild(this,l));
    }

}
