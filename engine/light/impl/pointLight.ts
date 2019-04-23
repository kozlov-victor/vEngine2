import {Point2d} from "../../geometry/point2d";
import {Rect} from "../../geometry/rect";
import {Game} from "../../game";
import {AbstractLight} from "../abstract/abstractLight";
import {Camera} from "../../renderer/camera";
import {IKeyVal} from "@engine/misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class PointLight extends AbstractLight {

    public static readonly LIGHT_TYPE:number = 0;

    public pos:Point2d = new Point2d();
    public nearRadius: number = 10;
    public farRadius: number = 100;
    public isOn:boolean = true;

    private _screenPoint = new Point2d();

    constructor(game:Game){
        super(game);
    }

    protected getPosScaled():Point2d {
        const camera:Camera = this.game.camera;
        const rect:Rect = camera.getRectScaled();
        const scale:Point2d = camera.scale;
        this._screenPoint.setXY(
            (this.pos.x - rect.point.x) * scale.x,
            (this.pos.y - rect.point.y) * scale.y
        );
        return this._screenPoint;
    }

    /** @private */
    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>, i:number):void{
        map[`u_pointLights[${i}].pos`] =  this.getPosScaled().toArray();
        map[`u_pointLights[${i}].nearRadius`] = this.nearRadius;
        map[`u_pointLights[${i}].farRadius`] = this.farRadius;
        map[`u_pointLights[${i}].isOn`] = this.isOn;
        map[`u_pointLights[${i}].color`] = this.color.asGL();
        map[`u_pointLights[${i}].intensity`] = this.intensity;
        map[`u_pointLights[${i}].type`] = PointLight.LIGHT_TYPE;
    }

}