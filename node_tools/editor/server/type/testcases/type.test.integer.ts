import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestInteger:ITestCase[] = [
    {
        description: 'check string conversion to integer',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer(),
                });
            const model = Dto.createInstance({
                age: '40',
            });
            expect(()=>model.age===40);
        },
    },
    {
        description: 'check wrong integer symbol',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer(),
                });
            const model = Dto.createInstance({
                age: '40q',
            });
        },
        onError: e=>{
            expect(()=>e.code==='integer' && e.field==='age');
        }
    },
    {
        description: 'check required integer',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer(),
                });
            const model = Dto.createInstance({

            });
        },
        onError: e=>{
            expect(()=>e.code==='required' && e.field==='age');
        }
    },
    {
        description: 'check optional integer',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Integer(),
                });
            const model = Dto.createInstance({

            });
            expect(()=>model.age===undefined)
        },
    },
    {
        description: 'check integer min value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer({min:18}),
                });
            const model = Dto.createInstance({
                age: 12,
            });
        },
        onError: e=>{
            expect(()=>e.code==='min' && e.field==='age');
        }
    },
    {
        description: 'check integer max value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer({max:45}),
                });
            const model = Dto.createInstance({
                age: 50,
            });
        },
        onError: e=>{
            expect(()=>e.code==='max' && e.field==='age');
        }
    },
    {
        description: 'check integer but not float',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Integer({max:45}),
                });
            const model = Dto.createInstance({
                age: 50.1,
            });
        },
        onError: e=>{
            expect(()=>e.code==='integer' && e.field==='age');
        }
    }
]
