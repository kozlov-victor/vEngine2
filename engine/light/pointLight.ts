import {Point2d} from "../geometry/point2d";
import {Rect} from "../geometry/rect";
import {Game} from "../game";
import {AbstractLight} from "./abstract/abstractLight";
import {Camera} from "../renderer/camera";
import {IKeyVal} from "@engine/misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class PointLight extends AbstractLight {

    public pos:Point2d = new Point2d();
    public nearRadius: number = 0;
    public farRadius: number = 0;
    public isOn:boolean = false;

    private _screenPoint = new Point2d();

    constructor(game:Game){
        super(game);
    }

    getPosScaled():Point2d {
        const camera:Camera = this.game.camera;
        const rect:Rect = camera.getRectScaled();
        const scale:Point2d = camera.scale;
        this._screenPoint.setXY(
            (this.pos.x - rect.point.x) * scale.x,
            (this.pos.y - rect.point.y) * scale.y
        );
        return this._screenPoint;
    }

    setUniforms(uniform:IKeyVal<UNIFORM_VALUE_TYPE>,i:number):void{
        uniform[`u_pointLights[${i}].pos`] =  this.getPosScaled().toArray();
        uniform[`u_pointLights[${i}].nearRadius`] = this.nearRadius;
        uniform[`u_pointLights[${i}].farRadius`] = this.farRadius;
        uniform[`u_pointLights[${i}].isOn`] = this.isOn;
        uniform[`u_pointLights[${i}].color`] = this.color.asGL();
    }

}