import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/geometry/image";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {ScrReader} from "./scrReader";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {CurtainOpeningTransition} from "@engine/scene/transition/appear/curtainOpeningTransition";

const files =
    'athena,brunilda,cauldron,dlair,example,Gauntlet,KValley,Phantis,test,wtss'.split(',').map(it=>`./zxSpectrumScr/files/${it}.scr`);
let ptr = 0;

export class MainScene extends Scene {

    private img:Image;


    public onPreloading() {
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfectMode(true);
        const img = new Image(this.game);
        this.img = img;
        const binary = this.resourceLoader.loadBinary(files[ptr++]);
        if (ptr>files.length-1) ptr = 0;
        this.resourceLoader.addNextTask(()=>{
            const reader = new ScrReader(this.game,binary.getTarget());
            const link = reader.createTextureLink();
            img.setResourceLink(link);
        });
        this.on(MOUSE_EVENTS.click, ()=>{
            this.game.runScene(new MainScene(this.game),new CurtainOpeningTransition(this.game));
        });
    }

    public onReady() {
        this.appendChild(this.img);
    }

}
