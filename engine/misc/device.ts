import {Game} from "../game";

declare let navigator:any;

export class Device {

    public static isCocoonJS:boolean = !!(navigator.isCocoonJS);
    public static scale:number = Device.isCocoonJS?(window.devicePixelRatio||1):1;
    public static isTouch:boolean = (typeof window !== 'undefined' && 'ontouchstart' in window);

    public static logInfo():void {
        console.log({
            isCocoonJS:Device.isCocoonJS,
            scale:Device.scale,
            isTouch: Device.isTouch
        });
    }

    constructor(private game:Game){
    }

}