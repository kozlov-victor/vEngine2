import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {IResource, IRevalidatable} from "@engine/core/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";

export class Sound implements IResource<void>,IRevalidatable {

    get loop(): boolean {
        return this._loop;
    }

    set loop(value: boolean) {
        this._loop = value;
        this.game.getAudioPlayer().loop(this);
    }

    get gain(): number {
        return this._gain;
    }

    set gain(value: number) {
        this._gain = value;
        this.game.getAudioPlayer().setGain(this);
    }

    get velocity(): number {
        return this._velocity;
    }

    set velocity(value: number) {
        this._velocity = value;
    }


    get stereoPan(): number {
        return this._stereoPan;
    }

    set stereoPan(value: number) {
        this._stereoPan = value;
    }

    public readonly type:string = 'Sound';
    public offset:number; // start offset time of sound
    public duration:number; // f this parameter isn't specified, the sound plays until it reaches its natural conclusion or is stopped

    private _loop:boolean = false;
    private _gain:number = 1;
    private _velocity:number = 1;
    private _stereoPan:number = 0.5;

    // resource
    private _resourceLink!:ResourceLink<void>;

    constructor(protected game:Game){}

    public revalidate():void {
        if (!this.getResourceLink()) throw new DebugError(`can not play sound: resource link is not set`);
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

    public setResourceLink(link:ResourceLink<void>):void{
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<void>{
        return this._resourceLink;
    }

}
