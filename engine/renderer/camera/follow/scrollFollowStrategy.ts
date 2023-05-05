import {ICameraFollowStrategy} from "@engine/renderer/camera/follow/cameraFollowStrategy";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Camera} from "@engine/renderer/camera/camera";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";

const clampCameraPos = (pos:Point2d, sceneSize: ISize, gameSize: ISize)=>{
    if (pos.x < 0) {
        pos.x = 0;
    }
    if (pos.y < 0) {
        pos.y = 0;
    }

    if (pos.x > sceneSize.width - gameSize.width) {
        pos.x = sceneSize.width - gameSize.width;
    }
    if (pos.y > sceneSize.height - gameSize.height) {
        pos.y = sceneSize.height - gameSize.height;
    }
}

export class ScrollFollowStrategy implements ICameraFollowStrategy {

    private targetObject:RenderableModel|undefined;
    private camera: Camera;

    constructor(private game:Game) {}

    public init(targetObject:RenderableModel|undefined,camera:Camera): void {
        this.targetObject = targetObject;
        this.camera = camera;
        if (targetObject!==undefined) {
            this.camera.pos.setXY(
                targetObject.pos.x - this.game.width/2,
                targetObject.pos.y - this.game.height/2
            );
            const scene = this.game.getCurrentScene();
            clampCameraPos(camera.pos,scene.size,this.game.size);
        }
    }

    public update(): void {
        const targetObject = this.targetObject;

        if (targetObject!==undefined) {

            const w = this.game.size.width;
            const h = this.game.size.height;
            const wDiv2 = w / 2;
            const hDiv2 = h / 2;
            const scene = this.game.getCurrentScene();

            const pos = this.camera.pos;
            const lerp = 0.05;
            pos.x +=(targetObject.pos.x - wDiv2 - pos.x) * lerp;
            pos.y +=(targetObject.pos.y - hDiv2 - pos.y) * lerp;

            clampCameraPos(pos,scene.size,this.game.size);

        }
    }

}
