import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";


export class MainScene extends Scene {

    @Resource.Texture('./catGame/res/sprite/tree.png')
    private treeLink:ResourceLink<ITexture>;

    public onReady() {

        const trees:RenderableModel[] = [];

        for (let i:number=0;i<100;i++) {
            const img = new Image(this.game);
            img.depthTest = true;
            img.setResourceLink(this.treeLink);
            img.pos.setXYZ(MathEx.random(0,this.game.width),400,MathEx.random(-500,500));
            trees.push(img);
        }

        trees.sort((a,b)=>a.pos.z-b.pos.z);
        trees.forEach(it=>this.appendChild(it));

        this.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.key) {

                case KEYBOARD_KEY.UP:
                    this.game.camera.pos.z-=1;
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.game.camera.pos.z+=1;
                    break;
                case KEYBOARD_KEY.LEFT:
                    this.game.camera.pos.x-=1;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.game.camera.pos.x+=1;
                    break;
                case KEYBOARD_KEY.W:
                    this.game.camera.pos.y-=1;
                    break;
                case KEYBOARD_KEY.S:
                    this.game.camera.pos.y+=1;
                    break;
            }
        });



    }

}
