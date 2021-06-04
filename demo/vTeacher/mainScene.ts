import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Board} from "./impl/board";

const isTeacher:boolean = location.href.indexOf('teacher')>0;


export class MainScene extends Scene {

    public override onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        const board = new Board(this.game,surface,isTeacher);
    }

}
