import {Layer} from "@engine/scene/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class RenderingSessionInfo {

    public drawingEnabled = true;
    public drawingStackEnabled = true;
    public currentLayer:Layer;
    public currentConstrainObjects:RenderableModel[] = [];

}
