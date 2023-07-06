import {isNumber} from "@engine/misc/object";

interface IParams {
    required?: boolean;
}

class SchemaValidator {

    public static readonly requiredFlag = 1;

    public static isRequired(val:string|number|boolean):boolean {
        if (typeof val ==='boolean') return val;
        return `${val}`===`${this.requiredFlag}`;
    }

    private static checkNumber(val:any) {
        return {
            passed: val!==true && val!==false && isNumber(+val),
            value: +val,
            type: 'number',
        }
    }

    private static checkString(val:any) {
        return {
            passed: val!==true && val!==false,
            value: `${val}`,
            type: 'string'
        }
    }

    private static checkBoolean(val:any) {
        return {
            passed: val===true || val===false,
            value: val,
            type: 'boolean'
        }
    }

    public static checkType(val:any,type:string|number|boolean) {
        const t = typeof type;
        switch (t) {
            case 'string': return this.checkString(val);
            case 'number': return this.checkNumber(val);
            case 'boolean': return this.checkBoolean(val);
            default:
                throw new Error(`unsupported type: ${t}`);
        }
    }

}

export class ValidationError extends Error {
    constructor(public field:string,public code:string) {
        super(`validation error for field "${field}" with code "${code}"`);
    }
}

export class Type {

    private static getPropValue(params:IParams) {
        if (params.required) return SchemaValidator.requiredFlag;
        return 0;
    }

    public static CreateModel<T extends Record<string, any>>(properties: T){
        const model = new Model(properties);
        return model as Model & T;
    }
    public static Number(params:IParams = {}):number|undefined {
        return this.getPropValue(params);
    }
    public static Boolean(params:IParams = {}):boolean|undefined {
        return this.getPropValue(params)===1;
    }
    public static String(params:IParams = {}):string|undefined {
        return `${this.getPropValue(params)}`;
    }
    public static Required<T extends string|number|boolean|undefined>(val:T) {
        return val!;
    }

}

class Model {

    constructor(private properties:Record<string, string|number>) {
    }

    public fromData(dataRecord:Record<string, any>,params:{ignoreUnknown?:boolean} = {}) {
        Object.keys(dataRecord).forEach(k=> {
            const dataRawVal = dataRecord[k];
            const typeVal = this.properties[k];
            if (typeVal===undefined) {
                if (!params.ignoreUnknown) {
                    throw new ValidationError(k,'unknown')
                }
                return; // ignore unknown property of data
            }
            const isRequired = SchemaValidator.isRequired(typeVal);
            if (
                isRequired &&
                (dataRawVal===null || dataRawVal===undefined || dataRawVal==='' || dataRawVal===false)
            ) {
                throw new ValidationError(k,'required');
            }
            if (dataRawVal===null || dataRawVal===undefined) return;
            const check = SchemaValidator.checkType(dataRawVal,typeVal);
            if (!check.passed) {
                throw new ValidationError(k,check.type);
            }
            (this as any)[k] = check.value;
        });
        return this;
    }

}

const model =
    Type.CreateModel({
        age: Type.Number({required: true}),
        salary: Type.Number(),
        name: Type.String(),
        login: Type.String(),
        save: Type.Boolean({required:true}),
    }).
    fromData({
        //age: 40,
        salary: 100,
        name: 100,
        login: 'test',
        save: true,
    },{ignoreUnknown:false});

console.log(model);
