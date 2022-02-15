import {Scene} from "@engine/scene/scene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

export class MainScene extends Scene {


    @Resource.Texture('./tileMap2/tiles2.png') private tilesTexture:ITexture;
    @Resource.JSON('./tileMap2/level.json') private levelData:ITiledJSON;


    public override onReady():void {

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromTiledJSON(this.levelData);

        const rect = new Rectangle(this.game);
        this.appendChild(tileMap);
        this.appendChild(rect);
        this.camera.followTo(rect);

        const v:number = 200;
        rect.pos.setXY(100,120);
        rect.size.setWH(50);

        const phys = this.game.getPhysicsSystem<ArcadePhysicsSystem>();

        rect.setRigidBody(phys.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC}));

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            const body = rect.getRigidBody<ArcadeRigidBody>()!;
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    body.velocity.setX(-v);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    body.velocity.setX(v);
                    break;
                case KEYBOARD_KEY.UP:
                    body.velocity.setY(-v);
                    break;
                case KEYBOARD_KEY.DOWN:
                    body.velocity.setY(v);
                    break;
            }
        });

    }

}
