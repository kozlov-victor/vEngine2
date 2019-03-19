

import {Shape} from "../generic/shape";
import {Cloneable} from "@engine/declarations";
import {Point2d} from "@engine/core/geometry/point2d";
import {Game} from "@engine/core/game";

export class Ellipse extends Shape implements Cloneable<Ellipse>{

    readonly type:string = 'Ellipse';
    readonly center:Point2d = new Point2d();

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

    get radiusX(): number {
        return this._radiusX;
    }

    set radiusX(value: number) {
        this._radiusX = value;
        this.width = this._getMaxRadius()*2;
        this.center.forceTriggerChange();
    }

    get radiusY(): number {
        return this._radiusY;
    }

    set radiusY(value: number) {
        this._radiusY = value;
        this.height = this._getMaxRadius()*2;
        this.center.forceTriggerChange();
    }

    private _getMaxRadius():number{
        return this._radiusX>this._radiusY?this._radiusX:this._radiusY;
    }

    draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

    protected setClonedProperties(cloned:Ellipse) {
        cloned.radiusX = this.radiusX;
        cloned.radiusY = this.radiusY;
        super.setClonedProperties(cloned);
    }

    update(){
        super.update();
    }

    clone():Ellipse {
        const cloned:Ellipse = new Ellipse(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}