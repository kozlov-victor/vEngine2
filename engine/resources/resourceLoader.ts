import loadRaw = LoaderUtil.loadRaw;
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Incrementer} from "@engine/resources/incrementer";
import {LoaderUtil} from "@engine/resources/loaderUtil";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "../game";
import {Queue} from "./queue";


export class ResourceLoader {

    public readonly q: Queue = new Queue();

    constructor(private game: Game) {
        this.game = game;
    }


    public loadImage(url: string): ResourceLink<Texture> {
        const link: ResourceLink<Texture> = new ResourceLink(url);
        this.q.addTask(() => {
            this.game.getRenderer().loadTextureInfo(
                url, link,
                () => this.q.resolveTask(url),
            );
        }, url);
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
        this.q.addTask(() => {
            this.game.getAudioPlayer().loadSound(
                url, link,
                () => this.q.resolveTask(url),
            );
        }, url);
        return link;
    }

    public loadBinary(url: string): ResourceLink<ArrayBuffer> {
        const link: ResourceLink<ArrayBuffer> = new ResourceLink<ArrayBuffer>(url);
        this.q.addTask(() => {
            loadRaw(url, "arraybuffer", (buff: ArrayBuffer) => {
                link.setTarget(buff);
                this.q.resolveTask(url);
            });
        }, url);
        return link;
    }

    public addNextTask(task: () => void) {
        const id: string = Date.now() + "_" + Incrementer.getValue();
        this.q.addTask(() => {
            task();
            this.q.resolveTask(id);
        }, id);
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
        this.q.addTask(() => {
            loadRaw(url, "text", (data: string) => {
                callback(data);
                this.q.resolveTask(url);
            });
        }, url);
    }


}
