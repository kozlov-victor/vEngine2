import {Game} from "@engine/game";
import {DebugError} from "@engine/debug/debugError";
import {IResource, IRevalidatable} from "@engine/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";

export class Sound implements IResource<void>,IRevalidatable {

    public readonly type:string = 'Sound';
    public loop:boolean = false;

    private _gain:number = 1;

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
    public setGain(val:number):void {
        this._gain = val;
        this.game.getAudioPlayer().setGain(this);
    }
    public getGain():number{
        return this._gain;
    }

    public setResourceLink(link:ResourceLink<void>):void{
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<void>{
        return this._resourceLink;
    }

}