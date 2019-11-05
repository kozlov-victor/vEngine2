


class DataBuffer {

    constructor(){
        this.memory = undefined; // Int8Array
        this.pointerExternal = 0;
        this.currPlayingByte = 0;
        this.currPlayingBit = 0;
        this.currSampleForThisBit = 0;
        this.samplesForOneBit = 10;
        this.currSample = 0;
        this.play();
    }

    readNextSample(){
        if (this.stopped) return 0;

        if (this.currPlayingByte>=this.pointerExternal) {
            this.currPlayingByte = this.pointerExternal;
            return 0;
        }
        const powOfTwo = Math.pow(2,this.currPlayingBit);
        const bit = (this.memory[this.currPlayingByte] & powOfTwo) >0? 1:0;
        const fr = bit?2044:1022;
        const t = this.currSample/sampleRate;
        const sample = Math.sin(2*3.14*fr*t);

        this.currSample++;
        this.currSampleForThisBit++;
        if (this.currSampleForThisBit>this.samplesForOneBit) {
            this.currSampleForThisBit = 0;
            this.currPlayingBit++;
        }
        if (this.currPlayingBit>7) {
            this.currPlayingBit = 0;
            this.currPlayingByte++;
        }

        return sample;

    }


    stop(){
        this.stopped = true;
    }

    play(){
        this.stopped = false;
    }

    setMemory(memory){
        this.memory = memory;
    }

    setPointerExternal(p){
        this.pointerExternal = p;
    }


}


class SoundProcessor extends AudioWorkletProcessor {

    // Custom AudioParams can be defined with this static getter.
    static get parameterDescriptors() {
        return [{ name: 'gain', defaultValue: 1 }];
    }

    constructor() {
        // The super constructor call is required.
        super();
        this.dataBuffer = new DataBuffer();
        this.port.onmessage = (e) => {
            const action = e.data.action;
            const payload = e.data.payload;
            switch (action) {
                case 'setMemory':
                    this.dataBuffer.setMemory(payload);
                    break;
                case 'setPointerExternal':
                    this.dataBuffer.setPointerExternal(payload);
                    break;
                case 'play':
                    this.dataBuffer.play();
                    break;
                case 'stop':
                    this.dataBuffer.stop();
                    break;
            }
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        //const next = this.dataBuffer.readNext();

        const channel = output[0];
        for (let i = 0; i < channel.length; i++) {
            channel[i] = this.dataBuffer.readNextSample();
        }

        // const l = output[0].length;
        // for (let i = 0; i < l; i++) {
        //     const sample = this.dataBuffer.readNextSample();
        //     for (let j = 0; j < outputs.length; j++) {
        //         const channelElement = outputs[j];
        //         channelElement[i] = sample;
        //     }
        // }
        return true;
    }
}

registerProcessor('snd-processor', SoundProcessor);
