import {Scene} from "@engine/scene/scene";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

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
        tileMap.fromData(data,30,undefined,32,32);
        this.tileMap = tileMap;

        this.appendChild(this.tileMap);
        this.appendChild(this.rect);
        this.camera.followTo(this.rect);


        const v:number = 1;
        //this.game.camera.pos.setXY(0.5);
        this.rect.pos.setY(120);

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    this.rect.pos.addX(-v);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.rect.pos.addX(v);
                    break;
                case KEYBOARD_KEY.UP:
                    this.rect.pos.addY(-v);
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.rect.pos.addY(v);
                    break;
                case KEYBOARD_KEY.R:
                    this.rect.angle+=0.1;
                    break;
            }
        });

    }

}
