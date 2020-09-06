import {Game} from "@engine/core/game";

export class FrameSkipper {

    private numOfSkippedFrames:number = 0;

    constructor(private game:Game) {
    }

    public willNextFrameBeSkipped():boolean {
        if (this.game.fps<20) {
            this.numOfSkippedFrames++;
            if (this.numOfSkippedFrames<8) {
                return true; // wait for better times to redraw frame
            }
            else {
                // no better times - redraw as is
                this.numOfSkippedFrames = 0;
                return false;
            }
        }
        this.numOfSkippedFrames = 0;
        return false;
    }

}
