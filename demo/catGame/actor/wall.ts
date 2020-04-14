import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {AbstractEntity, IExtraProperties} from "./abstract/abstract";
import {Color} from "@engine/renderer/common/color";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";


export class Wall extends AbstractEntity {

    public static readonly groupName:string = 'Wall';

    constructor(private game:Game, width:number,height:number,movePlatformInfo?:IExtraProperties) {
        super();
        const rect: Rectangle = new Rectangle(this.game);
        this.renderableImage = rect;

        rect.size.setWH(width,height);
        rect.fillColor = Color.NONE;
        rect.color = Color.RGB(122);
        const rigidBody: ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
                groupNames: [Wall.groupName],
                type:ARCADE_RIGID_BODY_TYPE.KINEMATIC
            });
        rect.setRigidBody(rigidBody);
        this.game.getCurrScene().appendChild(rect);
        if (movePlatformInfo?.fromY!==undefined) {
            this.startMoveableY(movePlatformInfo);
        }
    }

    private startMoveableY(movePlatformInfo:IExtraProperties){
        let d:number = 1;
        if (movePlatformInfo.fromY!>movePlatformInfo.toY!) {
            const tmp:Optional<number> = movePlatformInfo.fromY;
            movePlatformInfo.fromY = movePlatformInfo.toY;
            movePlatformInfo.toY = tmp;
        }
        const model:RenderableModel = this.renderableImage;
        this.game.getCurrScene().setInterval(()=>{
            model.pos.y+=d;
            if (model.pos.y>movePlatformInfo.toY!) d=-1;
            else if (model.pos.y<movePlatformInfo.fromY!) d=1;
        },20);
    }

}
