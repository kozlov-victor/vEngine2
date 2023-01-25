
export namespace NoiseGenerator {

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    export const getNextPinkNoiseSample = ():number=>{
        const white = getNextWhiteNoiseSample();
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        let out = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        out *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
        return out;
    }

    let lastOut = 0.0;

    export const getNextBrownNoiseSample = ():number=>{
        const white = getNextWhiteNoiseSample();
        let out = (lastOut + (0.02 * white)) / 1.02;
        lastOut = out;
        out*= 3.5; // (roughly) compensate for gain
        return out;
    }

    export const getNextWhiteNoiseSample = ():number=> {
        const r = Math.random();
        return r * 2 - 1;
    }

}
