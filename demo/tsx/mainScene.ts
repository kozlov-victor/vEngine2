import {Scene} from "@engine/scene/scene";
import {createUI} from "./ui";

export class MainScene extends Scene {

    public onReady() {
        this.appendChild(createUI());
    }

}
