import {Game} from "../../core/game";
import {AbstractLight} from "../abstract/abstractLight";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";

/*

                                &&&@@@@@@@@&&&
                      %@@@@@,,                  ,&@@@@&(
                 @@@@/                                  *@@@#
             &@@(                                            (@@/
          @@@                                                    @@&
       /@@                          ,@#,,                          ,@@.
     %@@                     %@@@@   @(    @@@@@                      @@
    @@                    @@@        @(          @@@                   ,@@
  /@@                  &@@           @(            *@@      ----->(2) &@@@@.
 (@,                 (@&             @(1)<-----      ,@@        @@@@@@/   #@
 @%                 (@(              @(                @@@@@@/             @@
@@                  @@               @(          &@@@@(,@,                 ,@,
@@                 ,@,               @(  ,#@@@@%        @@                  @@
@@                 ,@*               @@@&               @@                  @@
@@                  @@                                 @@                  ,@,
 @(                  @@                               @@                   @@
 %@                   (@@                           %@@                   (@
  (@                     @@/                      @@@                    %@
   .@@                     .@@@/             *@@@#                      @@
     %@&                         #@@@@@@@@@##                         @@
       &@@                                                          @@*
          @@                                                     %@@
             @@@                                              @@@
                .@@@&                                    &@@@.
                     ,@@@@@#                     (#@@@@&
                              //@@@@@@@@@@@@@@//

(1) - near radius
(2) - far radius
 */
export class PointLight extends AbstractLight {

    public static readonly LIGHT_TYPE:number = 0;

    public specular = 1;
    public nearRadius: number = 10;
    public farRadius: number = 100;
    public isOn:boolean = true;

    private readonly _screenPoint = new Float32Array([0,0]);

    constructor(game:Game){
        super(game);
    }

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void{
        const coords = this.getScreenCoords()[0];
        this._screenPoint[0] = coords[0];
        this._screenPoint[1] = coords[1];
        map.put(`u_pointLights[${i}].pos`,this._screenPoint);
        map.put(`u_pointLights[${i}].nearRadius`,this.nearRadius);
        map.put(`u_pointLights[${i}].farRadius`,this.farRadius);
        map.put(`u_pointLights[${i}].isOn`,this.isOn);
        map.put(`u_pointLights[${i}].color`,this.color.asGL());
        map.put(`u_pointLights[${i}].intensity`,this.intensity);
        map.put(`u_pointLights[${i}].type`,PointLight.LIGHT_TYPE);
        map.put(`u_pointLights[${i}].specular`,this.specular);
    }

    public draw(): void {}


}
