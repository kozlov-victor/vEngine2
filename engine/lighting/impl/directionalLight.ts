import {PointLight} from "@engine/lighting/impl/pointLight";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";
import {Vec4} from "@engine/geometry/vec4";
import {Mat4} from "@engine/misc/math/mat4";
import {Point2d} from "@engine/geometry/point2d";
import Vec4Holder = Vec4.Vec4Holder;
import multVecByMatrix = Mat4.multVecByMatrix;

/*


                                             %%
                                           @@@(
                                        .@@@#
                                       @@@
                                    %@@@
                                  #@@@
                               .@@@#
                             .@@@%
                            @@@
                         #@@@.
                       (@@# (@%
                     @@@#     *@.
                   @@@&        ,@,                       .&@@@@@@
                (@@@             @@               /@@@@@@@@
              (@@@.               @.      .%@@@@@@@,.   @@.
            /@@#                  @%&@@@@@@(/            @,
          @@@%             ,#@@@@@@@%                    &@
        @@@          @@@@@@@@     @@                     &@
     /@@@.   %&@@@@@@..           @@                      &@ <-------2
   /@@@@@@@@@/*                   @@  <------1            %@
   &@@@@@@@@@@(////,              @@                      %@
     /@@@&    #&&&&&@@@@@@@@@@@@@@@@@@@#....              @*
        *@@@                     @@.   (@@@@@@@@@@@@@@@@@@@@@@@@
           ,@@@,                .@,                        .,,,,@@@@
              &@@%*            %@
                 &@@&         @%
                   ,@@@@     #@
                      .@@@* /@/
                         &@@@@
                            %@@&
                              ,@@@@
                                  @@@*
                                    ,@@@/
                                       %@@@
                                          %@@@
                                             @@@@
                                                @@@(

(1) - far fieldAngle (rad)
(2) - near fieldAngle (rad)

 */


export class DirectionalLight extends PointLight {

    public static override readonly LIGHT_TYPE:number = 1;

    public direction = new Point2d(1,0);
    public nearFieldAngle = 0.6;
    public farFieldAngle = 0.8;

    private v4 = new Vec4Holder();
    private directionTransformed = new Float32Array([0,0]);

    public override setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void{
        super.setUniformsToMap(map,i);
        map.put(`u_pointLights[${i}].type`,DirectionalLight.LIGHT_TYPE);
        this.v4.set(this.direction.x,this.direction.y,0,0);
        multVecByMatrix(this.v4,this.worldTransformMatrix,this.v4);
        this.directionTransformed[0] = this.v4.vec4[0];
        this.directionTransformed[1] = this.v4.vec4[1];
        map.put(`u_pointLights[${i}].direction`,this.directionTransformed);
        map.put(`u_pointLights[${i}].nearFieldAngle`,this.nearFieldAngle);
        map.put(`u_pointLights[${i}].farFieldAngle`,this.farFieldAngle);
    }


}
