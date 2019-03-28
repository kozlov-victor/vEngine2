import {Game} from "../game";

declare let navigator:any;

export class Device {

    constructor(private game:Game){
    }

    static isCocoonJS:boolean = !!(navigator.isCocoonJS);
    static scale:number = Device.isCocoonJS?(window.devicePixelRatio||1):1;
    static isTouch:boolean = (typeof window !== 'undefined' && 'ontouchstart' in window);

    static logInfo(){
        console.log({
            isCocoonJS:Device.isCocoonJS,
            scale:Device.scale,
            isTouch: Device.isTouch
        })
    }

}