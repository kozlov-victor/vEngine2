import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MathEx} from "@engine/misc/math/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";


export class MainScene extends Scene {

    @Resource.Texture('./catGame/res/sprite/tree.png')
    public readonly treeTexture:ITexture;

    public override onReady():void {

        const trees:RenderableModel[] = [];

        for (let i:number=0;i<100;i++) {
            const img = new Image(this.game,this.treeTexture);
            img.depthTest = true;
            img.pos.setXYZ(MathEx.random(0,this.game.width),400,MathEx.random(-500,500));
            trees.push(img);
        }

        trees.sort((a,b)=>a.pos.z-b.pos.z);
        trees.forEach(it=>this.appendChild(it));

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {

                case KEYBOARD_KEY.UP:
                    this.camera.pos.z-=1;
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.camera.pos.z+=1;
                    break;
                case KEYBOARD_KEY.LEFT:
                    this.camera.pos.x-=1;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.camera.pos.x+=1;
                    break;
                case KEYBOARD_KEY.W:
                    this.camera.pos.y-=1;
                    break;
                case KEYBOARD_KEY.S:
                    this.camera.pos.y+=1;
                    break;
            }
        });



    }

}
