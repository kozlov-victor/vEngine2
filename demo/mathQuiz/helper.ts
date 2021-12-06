import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Game} from "@engine/core/game";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";

export const waitFor = (time:number):Promise<void>=> {
    return new Promise(resolve=>{
        setTimeout(()=>resolve(),time);
    });
}

export const waitForKey = (game:Game,key:KEYBOARD_KEY):Promise<void>=> {
    return new Promise(resolve=>{
        const lst = game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, (e)=>{
            if (e.key===key) {
                game.getCurrentScene().keyboardEventHandler.off(KEYBOARD_EVENTS.keyPressed,lst);
                resolve();
            }
        });
   });
}


const singletons:Record<string, any> = {}
export const singleton = <T extends ResourceAutoHolder>(key:string,factory:()=>T)=>{
    if (!singletons[key]) {
        singletons[key] = factory();
        console.log(singletons);
    }
    return singletons[key];
}
