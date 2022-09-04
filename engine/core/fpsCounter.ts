
export class FpsCounter {

    private _timeSpan:number = 0;
    private _frames:number = 0;
    private _fps:number = 0;

    public enterFrame(deltaTime:number):void {
        this._frames++;
        this._timeSpan+=deltaTime;
        if (this._timeSpan>1000) {
            this._fps = ~~(1000 * this._frames / this._timeSpan);
            this._frames = 0;
            this._timeSpan = 0;
        }
    }

    public getFps():number {
        return this._fps;
    }

}
