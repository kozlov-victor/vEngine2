import {AbstractEntity} from "../../abstract/abstractEntity";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {Size} from "@engine/geometry/size";
import {Rect} from "@engine/geometry/rect";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {AbstractCharacter} from "../../actor/abstract/abstractCharacter";


export class Water extends AbstractEntity {

    public static override readonly groupName:string = 'water';

    constructor(game: Game, spriteSheet: ITexture,size:Size) {
        super(game,spriteSheet,{
            groupNames: [Water.groupName],
            ignoreCollisionWithGroupNames: [AbstractCharacter.groupName],
            //debug: true,
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect: new Rect(0,0,size.width,size.height)
        });
        const img:Image = this.getRenderableModel() as Image;
        img.alpha = 0.5;
        img.size.setFrom(size);
        img.stretchMode = STRETCH_MODE.REPEAT;

        this.animateWater();
        this.listenCollisions();

    }

    private animateWater():void {
        const img:Image = this.getRenderableModel() as Image;
        this.game.getCurrentScene().setInterval(()=>{
            img.offset.x+=1;
        },10);
    }


    private listenCollisions():void {
        this.body.onOverlappedWithGroup(AbstractCharacter.groupName, e=>{
           e.velocity.y-=4;
        });
    }


}
