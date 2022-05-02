
export class BatchArray {

    private bufferArray:Float32Array;

    public constructor(batchSize: number,itemSize:number) {
        this.bufferArray = new Float32Array(batchSize*itemSize*4);
    }

    public setItem(index:number,item:Float32Array):void {

    }

}
