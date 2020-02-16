import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Optional} from "@engine/core/declarations";

// thanks to https://codepen.io/Blindman67/pen/pwVyVx

export const enum FindFreePointStrategy {
    GET_NEXT,
    GET_FREE,
    GET_OLDEST
}

export class WaterRippleFilter extends AbstractGlFilter {

    public findFreePointStrategy:FindFreePointStrategy = FindFreePointStrategy.GET_OLDEST;

    private readonly amount:string;
    private readonly time:string;

    private readonly dropVectors:number[];
    private currentDrop:number = 0;

    constructor(protected game:Game,private maxDrops:number = 32) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;

        this.dropVectors = new Array(3 * maxDrops);
        for (let i:number = 0; i < 3 * maxDrops; i++) {
            this.dropVectors[i] = -100;
        }

        this.amount = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'amount');
        this.time = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'time');

        //language=GLSL
        programGen.setFragmentMainFn(`
            precision mediump float;
			
            uniform vec3 drops[${maxDrops}]; // x,y are pos z is age

            vec2 offset;
            float dist;
            float wave;
            vec2 surf;
            vec2 dir;
            vec2 txC;
            float w;
            float cau;

            void main() {
                txC = v_texCoord;
                cau = distance(vec2(-1.0, -1.0), txC) * 20.0 + time;
                surf = vec2(sin(cau), cos(cau)) * 0.01;
                cau = distance(vec2(1.0, 1.0), txC) * 30.0 + time;
                surf += vec2(sin(cau), cos(cau)) * 0.02;
                for(int i = 0; i < ${maxDrops}; i+= 1){
                    if(drops[i].z > -90.0){
                        dir = drops[i].xy - txC;
                        dist = length(dir);
                        dir = normalize(dir);
                        w = cos((4.0 / (1.0 + pow(2.0, dist * 50.0 - drops[i].z))) * ${(Math.PI * 2).toFixed(6)}) * -0.5 + 0.5;
                        wave = w * pow(2.0, -dist * 8.0);
                        surf += dir * wave;
                    }
                }
                offset = v_texCoord + surf * amount;
                vec3 tx = vec3(v_texCoord, 0.0);
                vec3 norm = normalize(vec3(surf, 1.0));
                vec3 toLight = normalize(vec3(0.0, -0.0, 1.0) - tx);
                vec3 toCamera = normalize(vec3(0.0, 0.0, 1.0) - tx);
                vec3 lRef = normalize(2.0 * dot(norm, toLight) * norm - toLight);
                float spec = dot(lRef, toCamera) * 2.0;
                spec = clamp(spec, 0.0, 1.3) - 0.6;
                spec = pow(spec, 8.0) * 4.0;           
                vec4 col = texture2D(texture, offset);
                col.xyz = col.xyz + spec;
                gl_FragColor = col;
            }
        `);
        this.simpleRectDrawer.initProgram();
        this.setAmount(0.1);
    }

    public setAmount(val:number):void {
        this.setUniform(this.amount,val);
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{

        // animate drops
        const drops = this.dropVectors;
        for(let i:number = 0; i < this.maxDrops; i ++){
            if(drops[i * 3 + 2] > -90){
                drops[i * 3 + 2] += 0.1;
                if(drops[i * 3 + 2] > 50){
                    drops[i * 3 + 2] = -100;
                }
            }
        }
        this.setUniform('drops',drops);
        this.setUniform(this.time,this.game.getElapsedTime()/1_000);
        super.doFilter(destFrameBuffer);
    }

    public dropAt(x:number,y:number) {
        const ind:Optional<number> = this.getNextPointIndex();
        if (ind===undefined) return;
        this.dropVectors[ind]     = x / this.game.size.width;
        this.dropVectors[ind+1]   = y / this.game.size.height;
        this.dropVectors[ind+2]   = -2;
    }

    private getNextPointIndex():Optional<number> {
        (window as any).a = this.dropVectors;
        switch (this.findFreePointStrategy) {
            case FindFreePointStrategy.GET_NEXT: {
                return (this.currentDrop++ % this.maxDrops) * 3;
            }
            case FindFreePointStrategy.GET_FREE: {
                for (let i:number = 0; i < this.dropVectors.length; i+=3) {
                    if (this.dropVectors[i + 2] === -100) return i;
                }
                return undefined;
            }
            case FindFreePointStrategy.GET_OLDEST: {
                let maxIndex:number = 0;
                let max:number = this.dropVectors[0];
                for (let i:number = 0; i < this.dropVectors.length; i+=3) {
                    if (this.dropVectors[i + 2]===-100) return i; // free
                    if (this.dropVectors[i + 2]>max) {
                        max = this.dropVectors[i + 2];
                        maxIndex = i;
                    }
                }
                return maxIndex;
            }
            default: {
                return undefined;
            }
        }
    }


}
