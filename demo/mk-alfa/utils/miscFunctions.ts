import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export const createGlowTweenFilter = (game:Game,color:Color,glowValFrom:number,glowValTo:number,time:number):GlowFilter=>{
    const glow:GlowFilter = new GlowFilter(game,0.02);
    glow.setGlowColor(color);

    const tm:TweenMovie = new TweenMovie(game);
    tm.addTween(0,{
        target:{val:glowValFrom},
        progress:(obj:{val:number})=>{
            glow.setOuterStrength(obj.val);
        },
        time,
        from:{val:glowValFrom},
        to:{val:glowValTo}
    });
    tm.addTween(time,{
        target:{val:glowValTo},
        progress:(obj:{val:number})=>{
            glow.setOuterStrength(obj.val);
        },
        time,
        from:{val:glowValTo},
        to:{val:glowValFrom}
    });
    tm.loop(true);
    game.getCurrentScene().addTweenMovie(tm);
    return glow;
};

export const createScaleTweenMovie = (game:Game,from:number,to:number,time:number,target:RenderableModel)=>{
    const tm:TweenMovie = new TweenMovie(game);
    tm.addTween(0,{
        target:{val:from},
        progress:(obj:{val:number})=>{
            target.scale.setXY(obj.val);
        },
        time,
        from:{val:from},
        to:{val:to},
    });
    tm.addTween(time,{
        target:{val:to},
        progress:(obj:{val:number})=>{
            target.scale.setXY(obj.val);
        },
        time,
        from:{val:to},
        to:{val:from},
    });
    tm.loop(true);
    game.getCurrentScene().addTweenMovie(tm);
};
