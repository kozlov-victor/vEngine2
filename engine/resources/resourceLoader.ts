
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "../core/game";
import {Queue, TaskRef} from "./queue";
import {UrlLoader} from "@engine/resources/urlLoader";


export class ResourceLoader {

    public readonly q: Queue = new Queue();

    constructor(private game: Game) {
        this.game = game;
    }


    public loadImage(url: string): ResourceLink<Texture> {
        const link: ResourceLink<Texture> = new ResourceLink(url);
        const taskRef:TaskRef = this.q.addTask(() => {
            this.game.getRenderer().loadTextureInfo(
                url, link,
                () => this.q.resolveTask(taskRef),
            );
        });
        return link;
    }

    public loadText(url: string): ResourceLink<string> {
        const link: ResourceLink<string> = new ResourceLink(url);
        this._loadText(url, (data: string) => link.setTarget(data));
        return link;
    }

    public loadJSON(url: string): ResourceLink<string> {
        const link: ResourceLink<string> = new ResourceLink(url);
        this._loadText(url, (data: string) => link.setTarget(JSON.parse(data)));
        return link;
    }

    public loadSound(url: string): ResourceLink<void> {
        const link: ResourceLink<void> = new ResourceLink(url);
        const taskRef:TaskRef = this.q.addTask(() => {
            this.game.getAudioPlayer().loadSound(
                url, link,
                () => this.q.resolveTask(taskRef),
            );
        });
        return link;
    }

    public loadBinary(url: string): ResourceLink<ArrayBuffer> {
        const link: ResourceLink<ArrayBuffer> = new ResourceLink<ArrayBuffer>(url);
        const taskRef:TaskRef = this.q.addTask(() => {
            const loader:UrlLoader = new UrlLoader({url,responseType:'arraybuffer'});
            loader.onLoad = (buff: ArrayBuffer|string)=>{
                link.setTarget(buff as ArrayBuffer);
                this.q.resolveTask(taskRef);
            };
            loader.load();
        });
        return link;
    }

    public addNextTask(task: () => void) {
        const taskRef:TaskRef =  this.q.addTask(() => {
            task();
            this.q.resolveTask(taskRef);
        });
    }

    public startLoading(): void {
        this.q.start();
    }

    public isCompleted(): boolean {
        return this.q.isCompleted();
    }

    public getProgress(): number {
        return this.q.calcProgress();
    }

    public onProgress(fn: () => void): void {
        this.q.onProgress = fn;
    }

    public onCompleted(fn: () => void): void {
        this.q.onResolved = fn;
    }

    private _loadText(url: string, callback: (data:string)=>void): void {
        const taskRef:TaskRef = this.q.addTask(() => {
            const loader:UrlLoader = new UrlLoader({url,responseType:'text'});
            loader.onLoad = (data: ArrayBuffer|string)=>{
                callback(data as string);
                this.q.resolveTask(taskRef);
            };
            loader.load();
        });
    }


}
