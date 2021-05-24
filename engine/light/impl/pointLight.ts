import {Point2d} from "../../geometry/point2d";
import {Game} from "../../core/game";
import {AbstractLight} from "../abstract/abstractLight";
import {Camera} from "../../renderer/camera";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";


export class PointLight extends AbstractLight {

    public static readonly LIGHT_TYPE:number = 0;

    public readonly pos:Point2d = new Point2d();
    public nearRadius: number = 10;
    public farRadius: number = 100;
    public isOn:boolean = true;

    private readonly _screenPoint = new Point2d();

    constructor(game:Game){
        super(game);
    }

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void{
        map.put(`u_pointLights[${i}].pos`,this.getPositionRelativeToScreen().toArray());
        map.put(`u_pointLights[${i}].nearRadius`,this.nearRadius);
        map.put(`u_pointLights[${i}].farRadius`,this.farRadius);
        map.put(`u_pointLights[${i}].isOn`,this.isOn);
        map.put(`u_pointLights[${i}].color`,this.color.asGL());
        map.put(`u_pointLights[${i}].intensity`,this.intensity);
        map.put(`u_pointLights[${i}].type`,PointLight.LIGHT_TYPE);
    }

    private getPositionRelativeToScreen():Point2d {
        const camera:Camera = this.game.getCurrentScene().camera;
        this._screenPoint.setXY(
            (this.pos.x - camera.pos.x),
            (this.pos.y - camera.pos.y)
        );
        return this._screenPoint;
    }

}
