import {Scene} from "@engine/scene/scene";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    private tileMap:TileMap;
    private rect:Rectangle;

    @Resource.Texture('./tileMap/tiles.png')
    private tilesTexture:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        this.rect = rect;
    }


    public override onReady():void {

        const data:number[] =
            [
                2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                2,1,1,1,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                2,1,10,10,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,
                4,2,1,10,4,4,1,1,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,
                4,2,1,10,4,4,1,1,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                2,1,10,1,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,2,
                1,10,10,10,1,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,2,
                2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
                4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4
            ]

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromData(data,30,undefined,32,32, {useCollision:true,collideWithTiles:[10]});
        this.tileMap = tileMap;

        this.appendChild(this.tileMap);
        this.appendChild(this.rect);
        this.camera.followTo(this.rect);


        const v:number = 50;
        //this.game.camera.pos.setXY(0.5);
        this.rect.pos.setY(120);
        this.rect.transformPoint.setToCenter();
        this.rect.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC
        }));

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            const body = this.rect.getRigidBody<ArcadeRigidBody>()!;
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
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, (e:IKeyBoardEvent)=>{
            const body = this.rect.getRigidBody<ArcadeRigidBody>()!;
            body.velocity.setXY(0);
        });

    }

}
