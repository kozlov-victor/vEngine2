import {Scene} from "@engine/model/impl/general/scene";
import {TileMap} from "@engine/model/impl/general/tileMap";
import {Image} from "@engine/model/impl/geometry/image";
import {Color} from "@engine/renderer/color";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {KEYBOARD_KEY, KeyboardControl} from "@engine/control/keyboardControl";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    private tileMap:TileMap;
    private rect:Rectangle;

    public onPreloading() {
        const tileMap:TileMap = new TileMap(this.game);
        const img:Image = new Image(this.game);
        img.setResourceLink(this.resourceLoader.loadImage('tiles.png'));

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

        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENTS.KEY_HOLD, (e:KEYBOARD_KEY)=>{
            switch (e) {
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
            }
        });

    }

}
