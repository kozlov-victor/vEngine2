import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestBoolean:ITestCase[] = [
    {
        description: 'check optional boolean',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Boolean(),
                });
            const model = Dto.createInstance({

            });
            expect(()=>model.registered===undefined);
        },
    },
    {
        description: 'check required boolean (true)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Required.Boolean(),
                });
            const model = Dto.createInstance({
                registered: true,
            });
            expect(()=>model.registered);
        },
    },
    {
        description: 'check required boolean (false)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Required.Boolean(),
                });
            const model = Dto.createInstance({
                registered: false,
            });
        },
        onError: e=>expect(()=>e.code==='required' && e.field==='registered')
    },
    {
        description: 'check required boolean error for false value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Required.Boolean(),
                });
            const model = Dto.createInstance({
                registered: false,
            });
        },
        onError: e=>expect(()=>e.code==='required' && e.field==='registered')
    },
    {
        description: 'check required boolean error for undefined value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Required.Boolean(),
                });
            const model = Dto.createInstance({

            });
        },
        onError: e=>expect(()=>e.code==='required' && e.field==='registered')
    },
    {
        description: 'check boolean parse error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    registered: Type.Required.Boolean(),
                });
            const model = Dto.createInstance({
                registered: 'true'
            });
        },
        onError: e=>expect(()=>e.code==='boolean' && e.field==='registered')
    },

]
