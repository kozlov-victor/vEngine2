
export class PlayingContext {

    private readonly audioCtx:AudioContext;
    private readonly source: AudioBufferSourceNode;
    public readonly scriptNode: ScriptProcessorNode;

    constructor(private readonly sampleRate: number) {
        this.audioCtx = new AudioContext({sampleRate});
        this.source = this.audioCtx.createBufferSource();
        this.scriptNode = this.audioCtx.createScriptProcessor(4096, 1, 2);

        this.source.connect(this.scriptNode);
        this.scriptNode.connect(this.audioCtx.destination);
        this.source.start();

    }

    public async stop():Promise<void> {
        try {
            // this.scriptNode.onaudioprocess = null;
            // this.scriptNode.disconnect(this.audioCtx.destination);
            // this.source.disconnect(this.scriptNode);
            this.source.stop();
            //await this.audioCtx.close();
        } catch (e) {
            console.error(e);
        }
    }

}
