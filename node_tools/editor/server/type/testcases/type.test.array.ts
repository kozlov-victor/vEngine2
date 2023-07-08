import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestArray:ITestCase[] = [
    {
        description: 'check array of objects',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Class({
                    test: Type.String(),
                }))
            })
            const model = Dto.createInstance({
                arr: [{test:'item0'}]
            });
            expect(()=>model.arr[0].test==='item0');
        },
    },
    {
        description: 'check array of optional booleans',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Boolean())
            })
            const model = Dto.createInstance({
                arr: [false,undefined,true]
            });
            expect(()=>model.arr[0]===false);
        },
    },
    {
        description: 'check array of required booleans',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Boolean())
            })
            const model = Dto.createInstance({
                arr: [false]
            });
        },
        onError:e=>expect(()=>e.code==='required' && e.field==='arr[0]')
    },
    {
        description: 'check array of required integers (error)',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Integer())
            })
            const model = Dto.createInstance({
                arr: [1,2,3.3]
            });
        },
        onError:e=>expect(()=>e.code==='integer' && e.field==='arr[2]')
    },
    {
        description: 'check array of required integers (success)',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Integer())
            })
            const model = Dto.createInstance({
                arr: [1,2,3]
            });
            expect(()=>model.arr.length===3)
        },
        onError:e=>{}
    },
    {
        description: 'check array of primitive optional numbers',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Number())
            })
            const model = Dto.createInstance({
                arr: [undefined,42]
            });
            console.log(model);
            expect(()=>model.arr[0]===undefined && model.arr[1]===42);
        },
    },
    {
        description: 'check array of required numbers',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({
                arr: [7,undefined,42]
            });
        },
        onError:e=>expect(()=>e.code==='required' && e.field==='arr[1]')
    },
    {
        description: 'check array of required numbers item conversion',
        testFn:()=>{
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({
                arr: ['1','2','3','4']
            });
            expect(()=>model.arr[0]===1 && model.arr[1]===2);
        },
        onError:e=>{}
    },
    {
        description: 'check array of required numbers conversion error (string)',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({
                arr: [1,'2','not a number']
            });
        },
        onError: e => {
            console.log(e);
            expect(() => e.code === 'number' && e.field === 'arr[2]')
        }
    },
    {
        description: 'check array of required numbers conversion error (boolean)',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({
                arr: [1,'2',true]
            });
        },
        onError: e => {
            expect(() => e.code === 'number' && e.field === 'arr[2]')
        }
    },
    {
        description: 'check array of optional objects with optional fields',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Array(Type.Class({
                    a: Type.Number(),
                    b: Type.Number(),
                }))
            })
            const model = Dto.createInstance({
                arr: [{a:1},{b:2},undefined]
            });
            expect(()=>model.arr[0].a===1 && model.arr[3]===undefined)
        },
        onError: e => {

        }
    },
    {
        description: 'check array of optional objects with required fields',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Array(Type.Class({
                    a: Type.Required.Number(),
                    b: Type.Required.Number(),
                }))
            })
            const model = Dto.createInstance({
                arr: [{a:1},{b:2},undefined]
            });
        },
        onError: e => {
            expect(() => e.code === 'required' && e.field === 'b')
        }
    },
    {
        description: 'check optional array',
        testFn: () => {
            const Dto = Type.Class({
                field: Type.Number(),
                arr: Type.Array(Type.Class({
                    a: Type.Required.Number(),
                    b: Type.Required.Number(),
                }))
            })
            const model = Dto.createInstance({
                field: 1
            });
            expect(()=>model.field===1 && model.arr===undefined);
        },
        onError: e => {

        }
    },
    {
        description: 'check required array',
        testFn: () => {
            const Dto = Type.Class({
                field: Type.Number(),
                arr: Type.Required.Array(Type.Class({
                    a: Type.Required.Number(),
                    b: Type.Required.Number(),
                }))
            })
            const model = Dto.createInstance({
                field: 1
            });
        },
        onError: e => {
            expect(()=>e.code==='required' && e.field==='arr')
        }
    },
    {
        description: 'check optional array with required item',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({

            });
            expect(()=>model.arr===undefined);
        },
        onError: e => {

        }
    },
    {
        description: 'check required empty array with required item',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Required.Array(Type.Required.Number())
            })
            const model = Dto.createInstance({
                arr: []
            });
            expect(()=>model.arr.length===0);
        },
        onError: e => {

        }
    },
    {
        description: 'check array min length',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Required.Array(Type.Required.Number(),{minLength:3})
            });
            const model = Dto.createInstance({
                arr: [1,2]
            });
        },
        onError: e => {
            expect(()=>e.code==='minLength' && e.field==='arr')
        }
    },
    {
        description: 'check array max length',
        testFn: () => {
            const Dto = Type.Class({
                arr: Type.Required.Array(Type.Required.Number(),{maxLength:2})
            });
            const model = Dto.createInstance({
                arr: [1,2,3]
            });
        },
        onError: e => {
            expect(()=>e.code==='maxLength' && e.field==='arr')
        }
    },

]
