import {Layer} from "@engine/scene/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class RenderingSessionInfo {

    public drawingEnabled:boolean = true;
    public drawingStackEnabled:boolean = true;
    public currentLayer:Layer;
    public currentConstrainObjects:RenderableModel[] = [];

}
