import {isNumber, isObject} from "@engine/misc/object";
import {test} from "./type.test";

class SchemaValidator {

    private static checkNumber(key: string, val:any,type: tPrimitiveType,params:InternalTypeVal) {
        if (val===true || val===false || (typeof val==='string' && val[0]===' ') || !isNumber(+val)) {
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
        if (val===true || val===false || isObject(val) || Array.isArray(val)) {
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

    public static checkObject(key: string, val:any) {
        if (!isObject(val)) {
            throw new ValidationError(key,'object');
        }
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
        public static Class<T extends Record<string, any>>(properties: T){
            const cl = Type.Class(properties);
            cl.required = true;
            return cl;
        }
    }

    public static Class<T extends Record<string, any>>(properties: T){
        return new Class<T>(properties) as Class<T> & T;
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

class Class<T> {

    public required:boolean;

    constructor(private properties:T) {
    }

    private _createInstance(dataRecord:Record<string,any>, cl:Class<any>,params:Record<string, any>) {
        const properties = cl.properties as Record<string, any>;
        // check for unknown properties
        if (!params.ignoreUnknown) {
            Object.keys(dataRecord).forEach(k=>{
                if (properties[k]===undefined) {
                    throw new ValidationError(k,'unknown')
                }
            });
        }

        // create model
        const modelCreated:Record<string, any> = {};
        Object.keys(properties).forEach(k=> {
            const dataRawVal = dataRecord[k];
            const internalTypeValOrClass = properties[k] as unknown as InternalTypeVal|Class<any>;
            // check required field
            if (
                internalTypeValOrClass.required &&
                (dataRawVal===null || dataRawVal===undefined || dataRawVal==='' || dataRawVal===false)
            ) {
                throw new ValidationError(k,'required');
            }
            if (dataRawVal===null || dataRawVal===undefined) return;

            if (internalTypeValOrClass instanceof Class) {
                SchemaValidator.checkObject(k,dataRawVal);
                modelCreated[k] = this._createInstance(dataRawVal,internalTypeValOrClass, params); // recursively
            } else {
                const internalTypeVal = internalTypeValOrClass as InternalTypeVal;
                if (!internalTypeVal.type) {
                    throw new Error(`error type provided: ${JSON.stringify(internalTypeVal)}`)
                }
                (modelCreated)[k] =
                    SchemaValidator.validateTypeAndValueAnfGetMappedType(k, dataRawVal, internalTypeVal.type, internalTypeVal);
            }
        });
        return modelCreated;
    }

    public createInstance(dataRecord:Record<string, any>, params:{ignoreUnknown?:boolean} = {}) {
        return this._createInstance(dataRecord,this,params) as T;
    }

}

test();
