declare let navigator:any;

export class Device {

    public static readonly isTouch = ('ontouchstart' in window);
    public static readonly isFrame = window.top!==window.self;
    public static readonly isIPhone = navigator.platform.toLowerCase().indexOf('iphone')>-1;
    public static readonly isAndroid = navigator.userAgent.toLowerCase().indexOf('android')>-1;
    public static readonly isMobile =
        this.isIPhone || this.isAndroid;

    public static readonly embeddedEngine = navigator.userAgent==='vEngine';

    public static getScreenResolution():[number,number]{
        return [globalThis.innerWidth,globalThis.innerHeight];
    }

    public static logInfo():void {
        console.log({
            isTouch: Device.isTouch,
            isFrame: Device.isFrame,
            isIPhone: Device.isIPhone,
            isAndroid: Device.isAndroid,
            buildAt:BUILD_AT,
            embeddedEngine: Device.embeddedEngine,
            screenResolution: `${this.getScreenResolution()[0]}x${this.getScreenResolution()[1]}`,
        });
    }

    private constructor(){

    }

}
