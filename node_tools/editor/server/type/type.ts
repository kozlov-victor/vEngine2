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

    public static checkArray(key: string, val:any, params: InternalTypeVal) {
        if (!Array.isArray(val)) {
            throw new ValidationError(key,'array');
        }
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
        public static Array<T>(type:T,params:{minLength?:number,maxLength?:number} = {}) {
            const ar = Type.Array(type,params);
            ar.required = true;
            return ar;
        }
        public static Class<T extends Record<string, any>>(properties: T) {
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
    public static Array<T>(type:T,params:{minLength?:number,maxLength?:number} = {}) {
        let ret:ArrayClass<T>;
        if (type instanceof Class) {
            ret = new ArrayClass<T>({...(type as any).properties,...params});
        } else {
            ret = new ArrayClass<T>({...type,...params});
        }
        return ret as ArrayClass<T> & T[];
    }

}

class Class<T> {

    public required:boolean;

    constructor(private properties:T) {
    }

    private _canSkipOptionalType(internalTypeValOrClass:InternalTypeVal|Class<any>|ArrayClass<any>,dataRawVal:any,k:string):boolean {
        if (
            internalTypeValOrClass.required &&
            (dataRawVal===null || dataRawVal===undefined || dataRawVal==='' || dataRawVal===false)
        ) {
            throw new ValidationError(k,'required');
        }
        return dataRawVal === null || dataRawVal === undefined;
    }

    private _createInstance(dataRecord:Record<string,any>, cl:Class<any>,arrayKey:string|undefined,params:Record<string, any>) {
        const properties = cl.properties as Record<string, any>;

        // if properties already is primitive type
        if ((properties as InternalTypeVal).type) {
            return SchemaValidator.validateTypeAndValueAnfGetMappedType(arrayKey!, dataRecord, properties.type, properties as InternalTypeVal);
        }

        // check for unknown properties
        if (!params.ignoreUnknown) {
            Object.keys(dataRecord).forEach(k=>{
                if (properties[k]===undefined) {
                    throw new ValidationError(k,'unknown')
                }
            });
        }

        // resolve model
        const modelCreated:Record<string, any> = {};
        Object.keys(properties).forEach(k=> {
            const dataRawVal = dataRecord[k];
            const internalTypeValOrClass =
                properties[k] as unknown as InternalTypeVal|Class<any>|ArrayClass<any>;
            // check required field
            if (this._canSkipOptionalType(internalTypeValOrClass,dataRawVal,k)) return;

            if (internalTypeValOrClass instanceof ArrayClass) {
                SchemaValidator.checkArray(k,dataRawVal,internalTypeValOrClass.properties);
                modelCreated[k] = [];
                (dataRawVal as any[]).forEach((dataRawItem,i)=>{ // instantiate each array element recursively
                    // check required field
                    const arrKey = `${k}[${i}]`;
                    if (this._canSkipOptionalType(internalTypeValOrClass.properties,dataRawItem,arrKey)){
                        modelCreated[k].push(undefined);
                    } else {
                        modelCreated[k].push(this._createInstance(dataRawItem,internalTypeValOrClass, arrKey,params));
                    }
                });
            }
            else if (internalTypeValOrClass instanceof Class) {
                SchemaValidator.checkObject(k,dataRawVal);
                modelCreated[k] = this._createInstance(dataRawVal,internalTypeValOrClass, undefined, params); // recursively
            }
            else {
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
        if (this instanceof ArrayClass) {
            throw new Error(`root instance can not be an array`)
        }
        return this._createInstance(dataRecord,this,undefined,params) as T;
    }

}

class ArrayClass<T> extends Class<T> {
    constructor(itemProperties: T) {
        super(itemProperties);
    }
}


// test();
