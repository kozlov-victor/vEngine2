import {Scene} from "@engine/scene/scene";
import {TileMap} from "@engine/renderable/impl/general/tileMap";
import {Image} from "@engine/renderable/impl/geometry/image";
import {Color} from "@engine/renderer/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export class MainScene extends Scene {

    private tileMap:TileMap;
    private rect:Rectangle;

    public onPreloading() {
        const tileMap:TileMap = new TileMap(this.game);
        const img:Image = new Image(this.game);
        img.setResourceLink(this.resourceLoader.loadImage('./tileMap/tiles.png'));

        const data:number[] = [
            1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,1,0,0,0,1,
            1,0,9,9,0,0,0,1,0,0,0,1,
            1,0,9,3,3,0,0,1,0,0,0,0,
            1,0,9,3,3,0,0,1,0,0,0,0,
            1,0,9,0,0,0,0,1,0,0,0,1,
            1,0,9,9,9,0,0,1,0,0,0,1,
            1,1,1,1,1,1,1,1,1,2,2,1,
            3,3,3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,3,3,
        ];

        tileMap.fromTiledJSON(data,12);
        tileMap.spriteSheet = img;
        this.tileMap = tileMap;

        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        this.rect = rect;


    }


    public onUpdate(){
        //this.game.camera.pos.addX(0.2);
    }

    public onReady() {
        this.appendChild(this.tileMap);
        this.appendChild(this.rect);
        this.game.camera.followTo(this.rect);

        if (this.game.getRenderer().type==='WebGlRenderer') {
            //(this.tileMap.spriteSheet.getResourceLink().getTarget() as Texture).setInterpolationMode(INTERPOLATION_MODE.NEAREST);
        }


        const v:number = 1;
        //this.game.camera.pos.setXY(0.5);

        this.on(KEYBOARD_EVENTS.keyHold, (e:KeyBoardEvent)=>{
            switch (e.key) {
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
