import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestNumber:ITestCase[] = [
    {
        description: 'check string conversion to number',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Number(),
                });
            const model = Dto.createInstance({
                age: '40.1',
            });
            expect(()=>model.age===40.1);
        },
    },
    {
        description: 'check wrong numeric symbol',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Number(),
                });
            const model = Dto.createInstance({
                age: ' 40',
            });
        },
        onError: e=>{
            expect(()=>e.code==='number' && e.field==='age');
        }
    },
    {
        description: 'check required number',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Number(),
                });
            const model = Dto.createInstance({

            });
        },
        onError: e=>{
            expect(()=>e.code==='required' && e.field==='age');
        }
    },
    {
        description: 'check optional number',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Number(),
                });
            const model = Dto.createInstance({

            });
            expect(()=>model.age===undefined)
        },
    },
    {
        description: 'check number min value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Number({min:18}),
                });
            const model = Dto.createInstance({
                age: 12.1,
            });
        },
        onError: e=>{
            expect(()=>e.code==='min' && e.field==='age');
        }
    },
    {
        description: 'check number max value',
        testFn:()=>{
            const Dto =
                Type.Class({
                    age: Type.Required.Number({max:45}),
                });
            const model = Dto.createInstance({
                age: 50.1,
            });
        },
        onError: e=>{
            expect(()=>e.code==='max' && e.field==='age');
        }
    },
]
