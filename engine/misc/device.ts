import {Game} from "../core/game";

declare let navigator:any;

export class Device {

    public static readonly isCocoonJS:boolean = !!(navigator.isCocoonJS);
    public static readonly scale:number = Device.isCocoonJS?(globalThis.devicePixelRatio||1):1;
    public static readonly isTouch:boolean = ('ontouchstart' in window);
    public static readonly isFrame:boolean = window.top!==window.self;
    public static readonly isIPhone:boolean = navigator.platform.toLowerCase().indexOf('iphone')>-1;


    public static logInfo():void {
        console.log({
            isCocoonJS:Device.isCocoonJS,
            scale:Device.scale,
            isTouch: Device.isTouch,
            isFrame: Device.isFrame,
            isIPhone: Device.isIPhone,
        });
    }

    constructor(private game:Game){
    }

}