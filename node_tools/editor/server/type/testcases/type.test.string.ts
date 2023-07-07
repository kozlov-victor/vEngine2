import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestString:ITestCase[] = [
    {
        description: 'check optional empty string',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({

            });
            expect(()=>model.name===undefined);
        },
    },
    {
        description: 'check required string',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({
                name: 'test'
            });
            expect(()=>model.name==='test');
        },
    },
    {
        description: 'check string minLength',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String({minLength:10}),
                });
            const model = Dto.createInstance({
                name: 'test'
            });
        },
        onError:e=>expect(()=>e.code==='minLength' && e.field==='name')
    },
    {
        description: 'check string maxLength',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String({maxLength:2}),
                });
            const model = Dto.createInstance({
                name: 'test'
            });
        },
        onError:e=>expect(()=>e.code==='maxLength' && e.field==='name'),
    },
    {
        description: 'check number to string conversion',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({
                name: 100
            });
            expect(()=>model.name==='100');
        },
    },
    {
        description: 'check boolean to string conversion error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({
                name: false
            });
        },
        onError: e=>expect(()=>e.code==='string' && e.field==='name')
    },
    {
        description: 'check object to string conversion error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({
                name: {}
            });
            console.log(model);
        },
        onError: e=>expect(()=>e.code==='string' && e.field==='name')
    },
    {
        description: 'check array to string conversion error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                });
            const model = Dto.createInstance({
                name: [],
            });
            console.log(model);
        },
        onError: e=>expect(()=>e.code==='string' && e.field==='name')
    },
]
