import {Game} from "@engine/core/game";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";

export const waitFor = (time:number):Promise<void>=> {
    return new Promise(resolve=>{
        setTimeout(()=>resolve(),time);
    });
}

export const waitForKey = (game:Game,button:KEYBOARD_KEY):Promise<void>=> {
    return new Promise(resolve=>{
        const lst = game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, (e)=>{
            if (e.button===button) {
                game.getCurrentScene().keyboardEventHandler.off(KEYBOARD_EVENTS.keyPressed,lst);
                resolve();
            }
        });
   });
}
