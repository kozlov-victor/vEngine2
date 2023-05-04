import {ICameraFollowStrategy} from "@engine/renderer/camera/follow/cameraFollowStrategy";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Camera} from "@engine/renderer/camera/camera";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {Vec2} from "@engine/geometry/vec2";

export class ScrollFollowStrategy implements ICameraFollowStrategy {

    private targetObject:RenderableModel|undefined;
    private camera: Camera;

    private _objFollowToPrevPos = new Point2d();
    private _cameraPosCorrection = new Point2d();

    constructor(private game:Game) {}

    public init(targetObject:RenderableModel|undefined,camera:Camera): void {
        this.targetObject = targetObject;
        this.camera = camera;
        if (targetObject!==undefined) {
            this._objFollowToPrevPos.setFrom(targetObject.pos);
            this._cameraPosCorrection.setXY(
                targetObject.pos.x - this.game.width/2,
                targetObject.pos.y - this.game.height/2
            );
        }
    }

    public update(): void {
        const targetObject = this.targetObject;

        if (targetObject!==undefined) {

            const w = this.game.size.width;
            const h = this.game.size.height;
            const wDiv2 = w / 2;
            const hDiv2 = h / 2;
            const wDiv3 = w / 3;
            const hDiv3 = h / 3;
            const scene = this.game.getCurrentScene();
            const posCorrection = this._cameraPosCorrection;
            const pos = this.camera.pos;
            const cameraToleranceVal = 15;

            if ((targetObject.pos.x - this._objFollowToPrevPos.x)>cameraToleranceVal) { // camera moves right
                posCorrection.x = targetObject.pos.x - wDiv2 + wDiv3;
                this._objFollowToPrevPos.x = targetObject.pos.x;
            }
            else if ((targetObject.pos.x - this._objFollowToPrevPos.x)<-cameraToleranceVal) { // camera moves left
                posCorrection.x = targetObject.pos.x - wDiv2 - wDiv3;
                this._objFollowToPrevPos.x = targetObject.pos.x;
            }

            if ((targetObject.pos.y - this._objFollowToPrevPos.y)>cameraToleranceVal) { // camera moves down
                posCorrection.y = targetObject.pos.y - hDiv2 + hDiv3;
                this._objFollowToPrevPos.y = targetObject.pos.y;
            }
            else if ((targetObject.pos.y - this._objFollowToPrevPos.y)<-cameraToleranceVal) { // camera moves up
                posCorrection.y = targetObject.pos.y - hDiv2 - hDiv3;
                this._objFollowToPrevPos.y = targetObject.pos.y;
            }

            const dist = Vec2.distance(posCorrection,pos);
            const maxCorrectionLengthForOneFrame = 100;
            if (dist>maxCorrectionLengthForOneFrame) {
                const angle = Vec2.angleTo(pos,posCorrection);
                posCorrection.x = pos.x + maxCorrectionLengthForOneFrame * Math.cos(angle);
                posCorrection.y = pos.y + maxCorrectionLengthForOneFrame * Math.sin(angle);
            }


            if (posCorrection.x < 0) {
                posCorrection.x = 0;
            }
            if (posCorrection.y < 0) {
                posCorrection.y = 0;
            }

            if (posCorrection.x > scene.size.width - w) {
                posCorrection.x = scene.size.width - w;
            }
            if (posCorrection.y > scene.size.height - h) {
                posCorrection.y = scene.size.height - h;
            }

            const lerp = 0.05;
            pos.x +=(posCorrection.x - pos.x) * lerp;
            pos.y +=(posCorrection.y - pos.y) * lerp;

        }
    }

}
