import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {Point2d} from "@engine/geometry/point2d";
import {Optional} from "@engine/core/declarations";

class QuadPrimitive extends AbstractPrimitive {
    constructor(topLeft:Point2d,bottomLeft:Point2d,topRight:Point2d,bottomRight:Point2d) {
        super();
        this.init(topLeft,bottomLeft,topRight,bottomRight);
    }

    private init(topLeft:Point2d,bottomLeft:Point2d,topRight:Point2d,bottomRight:Point2d):void {
        this.vertexArr = [
            topLeft.x,topLeft.y,0,
            bottomLeft.x,bottomLeft.y,0,
            topRight.x,topRight.y,0,
            bottomRight.x,bottomRight.y,0,
        ];
        this.indexArr = [0,1,2,1,3,2];
        this.texCoordArr = [
            0, 1,
            0, 0,
            1, 1,
            1, 0,
        ];
    }

}

class QuadMesh extends Mesh3d {

    public declare _modelPrimitive: QuadPrimitive;

    private _vertexBufferDataToUpdate:Optional<Float32Array>;


    constructor(game:Game,topLeft:Point2d,bottomLeft:Point2d,topRight:Point2d,bottomRight:Point2d) {
        super(game,new QuadPrimitive(topLeft,bottomLeft,topRight,bottomRight));
    }


    public override onUpdatingBuffers():void {
        if (this._vertexBufferDataToUpdate===undefined) return;
        this.getBufferInfo().posVertexBuffer!.updateDada(this._vertexBufferDataToUpdate);
        this._vertexBufferDataToUpdate = undefined;
    }

    public updateVertexData(data:Float32Array):void {
        this._vertexBufferDataToUpdate = data;
    }

}

export class TextureQuad extends RenderableModel {

    private readonly mesh:QuadMesh;

    public readonly topLeft:Point2d = new Point2d();
    public readonly bottomLeft:Point2d = new Point2d();
    public readonly topRight:Point2d = new Point2d();
    public readonly bottomRight:Point2d = new Point2d();

    private _vertexData:Float32Array = new Float32Array(12);

    constructor(game:Game,texture:ITexture) {
        super(game);
        this.topLeft.setXY(0,0);
        this.bottomLeft.setXY(0,texture.size.height);
        this.topRight.setXY(texture.size.width,0);
        this.bottomRight.setXY(texture.size.width,texture.size.height);
        this.mesh = new QuadMesh(game,this.topLeft,this.bottomLeft,this.topRight,this.bottomRight);
        this.size.set(texture.size);
        this.mesh.texture = texture;
        this.mesh.invertY = true;

        this.listenToPoints();
    }

    private listenToPoints():void{
        this.topLeft.observe(()=>this.updateVertexData());
        this.bottomLeft.observe(()=>this.updateVertexData());
        this.topRight.observe(()=>this.updateVertexData());
        this.bottomRight.observe(()=>this.updateVertexData());
    }

    private updateVertexData():void {
        this._vertexData[0] = this.topLeft.x;
        this._vertexData[1] = this.topLeft.y;
        this._vertexData[2] = 0;

        this._vertexData[3] = this.bottomLeft.x;
        this._vertexData[4] = this.bottomLeft.y;
        this._vertexData[5] = 0;

        this._vertexData[6] = this.topRight.x;
        this._vertexData[7] = this.topRight.y;
        this._vertexData[8] = 0;

        this._vertexData[9] = this.bottomRight.x;
        this._vertexData[10] = this.bottomRight.y;
        this._vertexData[11] = 0;

        this.mesh.updateVertexData(this._vertexData);

    }


    public draw(): void {
        this.game.getRenderer().drawMesh3d(this.mesh);
    }

}
