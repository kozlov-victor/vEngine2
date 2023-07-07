import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestObject:ITestCase[] = [
    {
        description: 'check deep tested object',
        testFn:()=>{
            const Dto =
                Type.Class({
                    level1: Type.Class({
                        level2: Type.Class({
                            level3: Type.Class({
                                name: Type.String(),
                            })
                        })
                    }),
                });
            const model = Dto.createInstance({
                level1: {
                    level2: {
                        level3: {
                            name: 'deepTest'
                        }
                    }
                }
            });
            expect(()=>model.level1.level2.level3.name==='deepTest')
        },
        onError: e=>{},
    },
    {
        description: 'check embedded object',
        testFn:()=>{
            const Dto =
                Type.Class({
                    name: Type.String(),
                    obj: Type.Class({
                        name: Type.String(),
                    }),
                });
            const model = Dto.createInstance({
                name: 'test',
                obj: {
                    name: 'embeddedObject'
                }
            });
            expect(()=>model.obj.name==='embeddedObject')
        },
        onError: e=>{
            console.log(e);
        },
    },
    {
        description: 'embedded object parsing error (string)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    obj: Type.Class({
                        name: Type.String(),
                    }),
                });
            const model = Dto.createInstance({
                obj: 'expected object but got a string'
            });
        },
        onError: e=>expect(()=>e.code==='object' && e.field==='obj'),
    },
    {
        description: 'embedded object parsing error (number)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    obj: Type.Class({
                        name: Type.String(),
                    }),
                });
            const model = Dto.createInstance({
                obj: 42,//expected object but got a number
            });
        },
        onError: e=>expect(()=>e.code==='object' && e.field==='obj'),
    },
    {
        description: 'embedded object parsing error (boolean)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    obj: Type.Class({
                        name: Type.String(),
                    }),
                });
            const model = Dto.createInstance({
                obj: false,//expected object but got boolean
            });
        },
        onError: e=>expect(()=>e.code==='object' && e.field==='obj'),
    },
    {
        description: 'required object error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    obj: Type.Required.Class({

                    }),
                });
            const model = Dto.createInstance({

            });
        },
        onError: e=>expect(()=>e.code==='required' && e.field==='obj'),
    },
    {
        description: 'required deep object error',
        testFn:()=>{
            const Dto =
                Type.Class({
                    obj: Type.Required.Class({
                        obj2: Type.Required.Class({

                        }),
                    }),
                });
            const model = Dto.createInstance({
                obj: {}
            });
        },
        onError: e=>expect(()=>e.code==='required' && e.field==='obj2'),
    },
]
