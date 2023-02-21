import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_COLLISION_EVENT, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

const BASE_COLOR = ColorFactory.fromCSS(`#ffd9d9`);
const COLLIDED_COLOR = ColorFactory.fromCSS(`rgba(114, 114, 114, 0.57)`);

export class CharacterBullet {

    private readonly container:Rectangle;

    constructor(game:Game) {
        this.container = new Rectangle(game);
        this.container.lineWidth = 0;
        this.container.size.setWH(5);
        this.container.fillColor = BASE_COLOR;
        this.container.setRigidBody(game.getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            groupNames: ['characterBullet'],
            ignoreCollisionWithGroupNames: ['characterBullet','character'],
            gravityImpact: 0.1,
        }));
        this.container.getRigidBody<ArcadeRigidBody>().collisionEventHandler.on(ARCADE_COLLISION_EVENT.COLLIDED, e=>{
            this.container.getRigidBody<ArcadeRigidBody>().gravityImpact = 2;
            this.container.fillColor = COLLIDED_COLOR;
            this.container.setTimeout(()=>{
                if (!this.container.isDetached()) this.container.removeSelf();
            },600);
        })
        this.container.setTimeout(()=>{
            if (!this.container.isDetached()) this.container.removeSelf();
        },3000);
    }

    public getContainer():RenderableModel {
        return this.container;
    }

}
