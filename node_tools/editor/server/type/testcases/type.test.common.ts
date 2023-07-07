import {Type} from "../type";
import {expect, ITestCase} from "../test-runner";

export const typeTestCommon:ITestCase[] = [
    {
        description: 'check for unexpected property',
        testFn:()=>{
            const Dto =
                Type.Class({
                    knownProperty: Type.Required.String(),
                });
            const model = Dto.createInstance({
                knownProperty: 'known',
                unexpectedProperty: 'unexpected'
            },{ignoreUnknown:false});
        },
        onError: e=>{
            expect(()=>e.code==='unknown' && e.field==='unexpectedProperty')
        }
    },
    {
        description: 'allow unexpected property (explicit flag)',
        testFn:()=>{
            const Dto =
                Type.Class({
                    knownProperty: Type.Required.String(),
                });
            const model = Dto.createInstance({
                knownProperty: 'known',
                unexpectedProperty: 'unexpected'
            },{ignoreUnknown:true});
            expect(()=>model.knownProperty==='known' && (model as any)['unexpectedProperty']===undefined)
        },
        onError: e=>{}
    },
    {
        description: 'allow unexpected property (default behaviour)',
        testFn: () => {
            const Dto =
                Type.Class({
                    knownProperty: Type.Required.String(),
                });
            const model = Dto.createInstance({
                knownProperty: 'known',
                unexpectedProperty: 'unexpected'
            });
        },
        onError: e => expect(() => e.code === 'unknown' && e.field === 'unexpectedProperty')
    },
]
