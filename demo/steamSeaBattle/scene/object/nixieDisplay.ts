import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class NixieDisplay {

    constructor(
        private nixieTube0:RenderableModel,
        private nixieTube1:RenderableModel
    ){}

    public setNumber(n:number):void{
        if (n<0) n = 0;
        const first:number = parseInt(n/10+'');
        const second = n%10;
        this.nixieTube0._children.forEach((c:RenderableModel)=>c.visible=false);
        this.nixieTube1._children.forEach((c:RenderableModel)=>c.visible=false);
        this.nixieTube0._children[first].visible = true;
        this.nixieTube1._children[second].visible = true;
    }

}
