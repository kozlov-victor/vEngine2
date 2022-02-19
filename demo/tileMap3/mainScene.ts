import {Scene} from "@engine/scene/scene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {CrtScreenFilter} from "@engine/renderer/webGl/filters/texture/crtScreenFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";

export class MainScene extends Scene {

    private tileMap:TileMap;
    private rect:Rectangle;

    @Resource.Texture('./tileMap3/voda_pesok_trava_revision_2.png') private tilesTexture:ITexture;
    @Resource.JSON('./tileMap3/level.json') private levelData:ITiledJSON;

    public override onReady():void {

        this.filters = [new CrtScreenFilter(this.game)];

        this.rect = new Rectangle(this.game);
        this.rect.size.setWH(5);
        this.rect.pos.setXY(20);
        this.rect.transformPoint.setToCenter();
        this.rect.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
        }));
        this.appendChild(this.rect);
        this.rect.getRigidBody<ArcadeRigidBody>().onCollidedWithGroup('tileMap',e=>{
            //
        });

        const tileMap:TileMap = new TileMap(this.game,this.tilesTexture);
        tileMap.fromTiledJSON(this.levelData,{
            useCollision:true,
            collideWithTiles:[0,10,20,30,40,50,26,27,28,56,57,58,59],
            groupNames:['tileMap'],
        });
        this.tileMap = tileMap;

        this.prependChild(this.tileMap);
        this.camera.followTo(this.rect);

        const v:number = 50;
        this.rect.pos.setY(120);
        this.rect.transformPoint.setToCenter();

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
