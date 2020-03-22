declare let navigator:any;

export class Device {

    public static readonly isTouch:boolean = ('ontouchstart' in window);
    public static readonly isFrame:boolean = window.top!==window.self;
    public static readonly isIPhone:boolean = navigator.platform.toLowerCase().indexOf('iphone')>-1;
    public static readonly embeddedEngine:boolean = navigator.userAgent==='vEngine';


    public static logInfo():void {
        console.log({
            isTouch: Device.isTouch,
            isFrame: Device.isFrame,
            isIPhone: Device.isIPhone,
            buildAt:BUILD_AT,
            embeddedEngine: Device.embeddedEngine,
        });
    }

    private constructor(){}

}
