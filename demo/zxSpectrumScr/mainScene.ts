import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {ScrReader} from "./scrReader";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BORDER, SCALE} from "./index";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";

const files =
    'AAA - AY Megademo 3 Menu (2019),athena,brunilda,cauldron,dlair,example,Gauntlet,KValley,Phantis,test,wtss'.split(',').map(it=>`./zxSpectrumScr/files/${it}.scr`);
let ptr:number = 0;

export class MainScene extends Scene {

    private border:Image;
    private screen:Image;

    public onPreloading() {
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfectMode(true);
        const screen = new Image(this.game);
        const border = new Image(this.game);
        border.scale.setXY(SCALE);
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
            this.game.runScene(new MainScene(this.game),new CellsAppearingTransition(this.game));
        });
        this.border = border;
        this.screen = screen;

        this.filters = [new Barrel2DistortionFilter(this.game)];

    }

    public onReady() {
        this.border.appendChild(this.screen);
        this.border.setPixelPerfect(true);
        this.screen.setPixelPerfect(true);
        this.appendChild(this.border);
    }

}



