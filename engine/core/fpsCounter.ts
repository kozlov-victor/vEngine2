
export class FpsCounter {

    private timeSpan:number = 0;
    private frames:number = 0;
    private _fps:number = 0;

    public enterFrame(deltaTime:number):void {
        this.frames++;
        this.timeSpan+=deltaTime;
        if (this.timeSpan>1000) {
            this._fps = ~~(1000 * this.frames / this.timeSpan);
            this.frames = 0;
            this.timeSpan = 0;
        }
    }

    public getFps():number {
        return this._fps;
    }

}
