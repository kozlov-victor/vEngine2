import {WebAudioContextHolder} from "@engine/media/context/webAudioContext";


export class AudioStream {

    private gainWorkletNode:AudioWorkletNode;
    private ready:boolean = false;

    constructor(arr:Int8Array){
        const context =  WebAudioContextHolder.getNewAudioContext();
        if (!context.audioWorklet) return;
        context.audioWorklet.addModule('./zxSpectrumScr/snd-processor.js').then(() => {
            const oscillator = new OscillatorNode(context);
            const gainWorkletNode = new AudioWorkletNode(context, 'snd-processor');

            // AudioWorkletNode can be interoperable with other native AudioNodes.
            oscillator.connect(gainWorkletNode).connect(context.destination);
            oscillator.start();
            this.gainWorkletNode = gainWorkletNode;
            this.setMemory(arr);
            this.ready = true;
        });
    }

    public setPointer(p:number) {
        if (!this.ready) return;
        this.gainWorkletNode.port.postMessage({action: 'setPointerExternal',payload: p});
    }

    public stop(){
        if (!this.ready) return;
        this.gainWorkletNode.port.postMessage({action: 'stop'});
    }

    private setMemory(arr:Int8Array) {
        this.gainWorkletNode.port.postMessage({action: 'setMemory',payload: arr});
    }
}

