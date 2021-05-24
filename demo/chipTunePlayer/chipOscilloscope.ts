import {Sound} from "@engine/media/sound";
import {Game} from "@engine/core/game";
import {AbstractChipTrack} from "../pix32/ym-player/abstract/abstractChipTrack";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Timer} from "@engine/misc/timer";

const align = (s:string,length:number)=>{
    const diff:number = length - s.length;
    if (diff>0) {
        const filler:string = new Array<string>(diff).fill('0').join('');
        return `${filler}${s}`;
    } else return s;
};

export class ChipOscilloscope {

    private timer:Timer;

    public constructor(private game:Game) {

    }

    public listen(sound:Sound,track:AbstractChipTrack, textField:TextField):void{
        if (this.timer!==undefined) this.timer.kill();
        this.timer = this.game.getCurrentScene().setInterval((()=>{

            const time = sound.getCurrentTime();
            if (time===-1) return;
            const frame = track.getFrameSnapshotByTime(time);
            if (!frame) return;
            const periodA = (frame[1] & 0xF) << 8 | frame[0];
            const periodB = (frame[3] & 0xF) << 8 | frame[2];
            const periodC = (frame[5] & 0xF) << 8 | frame[4];

            let frA:number =  (1000000/(16*periodA)) || 1;
            let frB:number =  (1000000/(16*periodB)) || 1;
            let frC:number =  (1000000/(16*periodC)) || 1;
            if (Number.isNaN(frA)) frA = 0;
            if (Number.isNaN(frB)) frB = 0;
            if (Number.isNaN(frC)) frC = 0;
            if (frA===Infinity) frA = 0;
            if (frB===Infinity) frB = 0;
            if (frC===Infinity) frC = 0;

            const levelA = (frame[8] & 0xF)  * 0xFF;
            const levelB = (frame[9] & 0xF)  * 0xFF;
            const levelC = (frame[10] & 0xF) * 0xFF;

            const frInfo = `${align((~~frA).toString(16),4)} ${align((~~frB).toString(16),4)} ${align((~~frC).toString(16),4)}`;
            const levelInfo = `${align((~~levelA).toString(16),4)} ${align((~~levelB).toString(16),4)} ${align((~~levelC).toString(16),4)}`;
            textField.setText(`${frInfo}\n${levelInfo}`);
        }),10);
    }

}
