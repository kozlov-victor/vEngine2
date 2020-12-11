import {httpClient} from "@engine/debug/httpClient";
import {IResponse} from "./declarations";

export class Comet {

    private lastUpdated:number = 0;
    private tid:any;
    private currentXhr:XMLHttpRequest;

    constructor(private cb:(resp:IResponse)=>void, private repeat:boolean) {
        this.poll();
    }

    // private clearPolling(){
    //     clearTimeout(this.tid);
    //     this.currentXhr.abort();
    // }

    private poll():void{
        httpClient.post('getCommands',{lastUpdated:this.lastUpdated},(resp)=>{
            const r:IResponse = resp as unknown as IResponse;
            this.lastUpdated = r.lastUpdated;
            this.cb(r);
            if (this.repeat) {
                this.tid = setTimeout(()=>{
                    this.poll();
                },1000);
            }
        },()=>{
            if (this.repeat) {
                this.tid = setTimeout(()=>{
                    this.poll();
                },1000);
            }
        },(xhr)=>{
            this.currentXhr = xhr;
        });
    }

}
