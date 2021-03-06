import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";

export class Fan extends AbstractEntity {

    public static override readonly groupName:string = 'fan';

    constructor(game:Game,resource:ITexture) {
        super(game, resource, {
            groupNames: [Fan.groupName],
            type:ARCADE_RIGID_BODY_TYPE.KINEMATIC,
        });
        const model = this.getRenderableModel();
        model.alpha = 0.5;
        model.setInterval(()=>{
            model.angle+=0.1;
            model.angle%=Math.PI*2;
        },100);
    }

}
