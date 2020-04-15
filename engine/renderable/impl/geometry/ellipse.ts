import {Shape} from "../../abstract/shape";
import {ICloneable} from "@engine/core/declarations";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";

export class Ellipse extends Shape implements ICloneable<Ellipse>{

    public readonly type:string = 'Ellipse';

    get radiusX(): number {
        return this._radiusX;
    }

    set radiusX(value: number) {
        this._radiusX = value;
        this.size.width = this._getMaxRadius()*2;
        this.center.forceTriggerChange();
    }

    get radiusY(): number {
        return this._radiusY;
    }

    set radiusY(value: number) {
        this._radiusY = value;
        this.size.height = this._getMaxRadius()*2;
        this.center.forceTriggerChange();
    }

    public readonly center:Point2d = new Point2d();

    public arcAngleFrom:number = 0;
    public arcAngleTo:number = 0;
    public anticlockwise:boolean = false;

    private _radiusX: number = 10;
    private _radiusY: number = 20;

    constructor(protected game:Game) {
        super(game);
        this.center.observe(()=>{
            const maxR:number = this._getMaxRadius();
            this.pos.setXY(this.center.x - maxR,this.center.y - maxR);
        });
        this.pos.observe(()=>{
            const maxR:number = this._getMaxRadius();
            this.center.setXY(this.pos.x+maxR,this.pos.y+maxR);
        });
    }

    public draw():void{
        this.game.getRenderer().drawEllipse(this);
    }

    public update():void {
        super.update();
    }

    public clone():Ellipse {
        const cloned:Ellipse = new Ellipse(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    protected setClonedProperties(cloned:Ellipse):void {
        cloned.radiusX = this.radiusX;
        cloned.radiusY = this.radiusY;
        cloned.arcAngleFrom = this.arcAngleFrom;
        cloned.arcAngleTo = this.arcAngleTo;
        cloned.anticlockwise = this.anticlockwise;
        super.setClonedProperties(cloned);
    }

    private _getMaxRadius():number{
        return this._radiusX>this._radiusY?this._radiusX:this._radiusY;
    }

}
