import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class CharacterBullet {

    private readonly container:Rectangle;

    constructor(game:Game) {
        this.container = new Rectangle(game);
        this.container.lineWidth = 0;
        this.container.size.setWH(5);
        this.container.fillColor = ColorFactory.fromCSS(`#fff`);
        this.container.setRigidBody(game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            groupNames: ['characterBullet'],
            ignoreCollisionWithGroupNames: ['characterBullet','character'],
        }));
        this.container.setTimeout(()=>{
            if (!this.container.isDetached()) this.container.removeSelf();
        },3000);
    }

    public getContainer():RenderableModel {
        return this.container;
    }

}
