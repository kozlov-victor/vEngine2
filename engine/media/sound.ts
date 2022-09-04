import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";

export class Sound {

    private readonly url:string;

    public get loop(): boolean {
        return this._loop;
    }

    public set loop(value: boolean) {
        this._loop = value;
        this.game.getAudioPlayer().loop(this);
    }

    public get gain(): number {
        return this._gain;
    }

    public set gain(value: number) {
        this._gain = value;
        this.game.getAudioPlayer().setGain(this);
    }

    public get velocity(): number {
        return this._velocity;
    }

    public set velocity(value: number) {
        this._velocity = value;
    }


    public get stereoPan(): number {
        return this._stereoPan;
    }

    public set stereoPan(value: number) {
        this._stereoPan = value;
    }

    constructor(protected game:Game,private uploadedSoundLink:UploadedSoundLink){
        this.url = uploadedSoundLink.url;
    }

    public readonly type:string = 'Sound';
    public offset:number; // start offset time of sound
    public duration:number; // if this parameter isn't specified, the sound plays until it reaches its natural conclusion or is stopped

    public feedbackDelay = {
        delayTime: 0,
        gain: 0.8
    };

    private _loop:boolean = false;
    private _gain:number = 1;
    private _velocity:number = 1;
    private _stereoPan:number = 0.5;

    public getCurrentTime():number {
        const node =  this.game.getAudioPlayer().getNodeBySound(this);
        if (node===undefined) return -1;
        return node.getCurrentTime();
    }

    public play():void {
        this.game.getAudioPlayer().play(this);
    }
    public stop():void {
        this.game.getAudioPlayer().stop(this);
    }
    public pause():void {
        throw new DebugError('not implemented');
    }
    public getUrl():string {
        return this.url;
    }

}
