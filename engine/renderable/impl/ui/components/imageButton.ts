import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/geometry/image";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class ImageButton extends RenderableModel {


    constructor(
        protected game:Game,
        private readonly imgOn:Image,
        private readonly imgOff:Image)
    {
        super(game);
    }

    public triggerOn():void {
        this.imgOff.visible = false;
    }

    public triggerOff():void {
        this.imgOff.visible = true;
    }

    public draw(): void {}

    public revalidate(): void {
        if (!this.children.length) {
            this.appendChild(this.imgOn);
            this.appendChild(this.imgOff);
            this.triggerOff();
            this.manageEvents();
        }
        super.revalidate();
    }

    private manageEvents(){
        this.on(MOUSE_EVENTS.click,()=>{
            this.triggerOn();
        });
        this.on(MOUSE_EVENTS.mouseUp,()=>{
            this.triggerOff();
        });
    }


}