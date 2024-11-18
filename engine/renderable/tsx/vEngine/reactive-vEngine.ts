import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Game} from "@engine/core/game";
import {DI} from "@engine/core/ioc";

export const ReactiveVEngine = {
    OnceKeyPressed: function(key:KEYBOARD_KEY) {
        return (originalMethod:any,context:ClassMethodDecoratorContext) => {
            context.addInitializer(function(){
                const game = DI.getInstance<Game>('Game');
                game.getCurrentScene().keyboardEventHandler.onceKeyPressed(key,()=>{
                    originalMethod.apply(this,[]);
                });
            });
        };
    },
    OnKeyPressed: function(key:KEYBOARD_KEY) {
        return (originalMethod:any,context:ClassMethodDecoratorContext) => {
            context.addInitializer(function(){
                const game = DI.getInstance<Game>('Game');
                game.getCurrentScene().keyboardEventHandler.onKeyPressed(key,()=>{
                    originalMethod.apply(this,[]);
                });
            });
        };
    },
}
