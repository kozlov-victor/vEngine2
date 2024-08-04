import {BitStream} from "./bitStream";
import {ZxScreen} from "./screen";

// A '0' bit is encoded as 2 pulses of 855 T-states each.
// A '1' bit is encoded as 2 pulses of 1710 T-states each (ie. twice the length of a '0')
// t-state is just a "time state" — a single cycle of the ~3.5Mhz clock.
const CLOCK = 3_500_000;
export const ZeroLenSeconds = 855/CLOCK;
export const OneLenSeconds = 1710/CLOCK;

export class TapePlayer {

    private readonly audioCtx:AudioContext;
    private readonly source: AudioBufferSourceNode;
    public readonly scriptNode: ScriptProcessorNode;
    public readonly sampleRate = 8000;
    private currentBit:1|0;
    private lastTime:number;
    private isSecondPulse = false;
    private bitStream: BitStream;
    private started = false;

    constructor(bin:ArrayBuffer, private screen:ZxScreen) {
        this.bitStream = new BitStream(bin);
        this.audioCtx = new AudioContext({sampleRate:this.sampleRate});
        this.source = this.audioCtx.createBufferSource();
        this.scriptNode = this.audioCtx.createScriptProcessor(1024, 1, 1);
        this.onAudioProcess();
    }

    private onAudioProcess() {
        let sample = 0;
        this.scriptNode.onaudioprocess = (audioProcessingEvent)=> {
            const outputData = audioProcessingEvent.outputBuffer.getChannelData(0);
            for (let i = 0; i < outputData.length; i++) {
                outputData[i] = this.getSample(sample);
                if (this.bitStream.isEof()) {
                    this.stop();
                    this.screen.clearBorder();
                    this.flushReadBytes();
                    return;
                }
                sample++;
            }
            this.flushReadBytes();
        };
    }

    private flushReadBytes() {
        const bytesRead = this.bitStream.flushReadBytes();
        for (const b of bytesRead) {
            this.screen.readNextByte(b);
        }
    }

    public start() {
        this.source.connect(this.scriptNode);
        this.scriptNode.connect(this.audioCtx.destination);
        this.source.start();
        this.started = true;
    }

    public stop() {
        if (this.started) {
            this.source.stop();
        }
        this.source.disconnect();
        this.scriptNode.disconnect();
    }

    private getSample(sampleNum:number) {
        const t = sampleNum / this.sampleRate;
        if (!this.lastTime) this.lastTime = t;
        const dur = this.currentBit===0?ZeroLenSeconds:OneLenSeconds;
        if (t-this.lastTime>=dur) {
            this.lastTime = t;
            if (!this.isSecondPulse) {
                this.isSecondPulse = true;
            }
            else {
                this.isSecondPulse = false;
                this.currentBit = this.bitStream.readNextBit();
            }
        }
        //this.currentBit = this.bitStream.readNextBit();
        return this.isSecondPulse?-1:1;
    }


}
