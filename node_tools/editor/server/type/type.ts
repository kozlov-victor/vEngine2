import {isNumber} from "@engine/misc/object";

class SchemaValidator {

    private static checkNumber(key: string, val:any,type: tPrimitiveType,params:InternalTypeVal) {
        if (val===true && val===false && !isNumber(+val)) {
            throw new ValidationError(key,type);
        }
        val = +val;

        if (params.min!==undefined) {
            if (val<params.min) {
                throw new ValidationError(key,'min');
            }
        }
        if (params.max!==undefined) {
            if (val>params.max) {
                throw new ValidationError(key,'max');
            }
        }

        return val;
    }

    private static checkInteger(key: string, val:any,type: tPrimitiveType,params:InternalTypeVal) {
        if (!Number.isInteger(+val)) {
            throw new ValidationError(key,type);
        }
        return this.checkNumber(key,val,type,params);
    }


    private static checkString(key: string,val:any,type: tPrimitiveType,params:InternalTypeVal) {
        if (val==true && val==false) {
            throw new ValidationError(key,type);
        }
        val = `${val}`;

        if (params.minLength!==undefined) {
            if (val.length<params.minLength) {
                throw new ValidationError(key,'minLength');
            }
        }
        if (params.maxLength!==undefined) {
            if (val.length>params.maxLength) {
                throw new ValidationError(key,'maxLength');
            }
        }

        return val;
    }

    private static checkBoolean(key: string, val:any,type: tPrimitiveType, params:InternalTypeVal) {
        if (val!==true && val!==false) {
            throw new ValidationError(key,type);
        }
        return val;
    }

    public static validateTypeAndValueAnfGetMappedType(key:string, val:any, type: tPrimitiveType,params:InternalTypeVal) {
        const t = params.type;
        switch (t) {
            case 'string': return this.checkString(key, val, type, params);
            case 'number': return this.checkNumber(key, val, type, params);
            case 'integer': return this.checkInteger(key, val, type, params);
            case 'boolean': return this.checkBoolean(key, val, type, params);
            default:
                throw new Error(`unsupported type: ${t}`);
        }
    }

}

export class ValidationError extends Error {
    public readonly type = 'ValidationError';

    constructor(public field:string,public code:string) {
        super();
        this.message = `validation error for field "${field}" with code "${code}"`;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }
    }
}

type tPrimitiveType = 'string'|'number'|'boolean'|'integer';

interface InternalTypeVal {
    type: tPrimitiveType;
    min?:number;
    max?:number;
    minLength?:number;
    maxLength?:number;
    required?: boolean;
}

interface INumberParams {
    min?:number;
    max?:number;
}

interface IStringParams {
    minLength?:number;
    maxLength?:number;
}

export class Type {

    public static Required = class {
        public static Number(params:{min?:number,max?:number} = {}):number {
            return Type.Number({...params,required:true} as INumberParams)!;
        }
        public static Integer(params:{min?:number,max?:number} = {}):number {
            return Type.Integer({...params,required:true} as INumberParams)!;
        }
        public static Boolean():boolean {
            return Type.Boolean({required:true} as any)!;
        }
        public static String(params:{minLength?:number,maxLength?:number} = {}):string {
            return Type.String({...params,required:true} as IStringParams)!;
        }
    }

    public static Class<T extends Record<string, any>>(properties: T){
        const model = new Model(properties);
        return model as Model & T;
    }
    public static Number(params:INumberParams = {}):number|undefined {
        return {...params,type:'number'} as InternalTypeVal as unknown as number;
    }
    public static Integer(params:INumberParams = {}):number|undefined {
        return {...params,type:'integer'} as InternalTypeVal as unknown as number;
    }
    public static Boolean(params:Record<string, never> = {}):boolean|undefined {
        return {...params,type:'boolean'} as InternalTypeVal as unknown as boolean;
    }
    public static String(params:IStringParams = {}):string|undefined {
        return {...params,type:'string'} as InternalTypeVal as unknown as string;
    }

}

class Model {

    constructor(private properties:Record<string, string|number|boolean>) {
    }

    public createInstance(dataRecord:Record<string, any>, params:{ignoreUnknown?:boolean} = {}) {
        const modelCreated:Record<string, any> = {};
        Object.keys(this.properties).forEach(k=> {
            const dataRawVal = dataRecord[k];
            const internalTypeVal = this.properties[k] as unknown as InternalTypeVal;
            const typeVal = internalTypeVal.type;
            if (typeVal===undefined) {
                if (!params.ignoreUnknown) {
                    throw new ValidationError(k,'unknown')
                }
                return; // ignore unknown property of data
            }
            if (
                internalTypeVal.required &&
                (dataRawVal===null || dataRawVal===undefined || dataRawVal==='' || dataRawVal===false)
            ) {
                throw new ValidationError(k,'required');
            }
            if (dataRawVal===null || dataRawVal===undefined) return;
            (modelCreated)[k] =
                SchemaValidator.validateTypeAndValueAnfGetMappedType(k, dataRawVal, typeVal, internalTypeVal);
        });
        return modelCreated as this;
    }

}

const model =
    Type.Class({
        age: Type.Required.Integer(),
        salary: Type.Integer({max:50}),
        name: Type.String(),
        login: Type.String({minLength: 1,maxLength: 20}),
        save: Type.Required.Boolean(),
    }).
    createInstance({
        age: 40,
        salary: 50,
        name: 100,
        login: 'test',
        save: true,
    },{ignoreUnknown:false});

console.log(model);
