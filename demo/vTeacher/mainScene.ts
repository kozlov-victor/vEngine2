import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Board} from "./impl/board";

const isTeacher:boolean = location.href.indexOf('teacher')>0;


export class MainScene extends Scene {


    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        const board = new Board(this.game,surface,isTeacher);
    }

}
