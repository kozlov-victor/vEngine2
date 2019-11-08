import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/geometry/image";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {ScrReader} from "./scrReader";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {BORDER} from "./index";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";

const files =
    'AAA - AY Megademo 3 Menu (2019),athena,brunilda,cauldron,dlair,example,Gauntlet,KValley,Phantis,test,wtss'.split(',').map(it=>`./zxSpectrumScr/files/${it}.scr`);
let ptr = 0;

export class MainScene extends Scene {

    private border:Image;
    private screen:Image;

    public onPreloading() {
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfectMode(true);
        const screen = new Image(this.game);
        const border = new Image(this.game);
        screen.pos.setXY(BORDER);
        const binary = this.resourceLoader.loadBinary(files[ptr++]);
        if (ptr>files.length-1) ptr = 0;
        this.resourceLoader.addNextTask(()=>{
            const reader = new ScrReader(this.game,binary.getTarget());
            const {borderLink,screenLink} = reader.links;
            border.setResourceLink(borderLink);
            screen.setResourceLink(screenLink);
        });
        this.on(MOUSE_EVENTS.click, ()=>{
            this.game.runScene(new MainScene(this.game),new CurtainsOpeningTransition(this.game));
        });
        this.border = border;
        this.screen = screen;

        this.filters = [new Barrel2DistortionFilter(this.game)];

    }

    public onReady() {
        this.border.appendChild(this.screen);
        this.appendChild(this.border);
    }

}



