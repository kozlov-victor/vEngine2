type Constructor<T = Record<any, any>> = new (...args: any[]) => T;
const DIContext:Record<string, any> = {};


export const DI = {
    registerInstance: (instance:any):void=>{
        const tkn = instance.constructor.name;
        instance.constructor.__injectable = tkn;
        DIContext[tkn] = instance;
    },
    getInstance: <T>(tkn:string):T=>{
        const res = DIContext[tkn];
        if (!res) {
            throw new Error(`instance is not registered: ${tkn}`);
        }
        return res as T;
    },
    Injectable: ()=> {
        return function ClassDecorator<C extends Constructor>(
            target: C,
            ctx: ClassDecoratorContext,
        ) {
            return class extends target {
                public static __injectable = target.name;
                public static __constructorArgumentsLength = target.length;
                constructor(...args: any[]) {
                    super(...args);
                    DIContext[target.name] = this;
                }
            } as C;
        };
    },
    Inject: <T>(clazz:Constructor<T>)=>{
        return <This,Value extends T>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            context.addInitializer(function(){
                if (!clazz) {
                    throw new Error(`can not inject: class is ${clazz}. Do you have a circular dependency?`);
                }
                const thisToken = (this as any).constructor.__injectable as string;
                if (!thisToken) {
                    console.error(this);
                    throw new Error(`not injectable: ${(this as any).constructor.name}`);
                }
                const injectToken = (clazz as any).__injectable;
                if (!injectToken) {
                    throw new Error(`not injectable: consider adding @Injectable() decorator to class ${clazz.name}`);
                }
                //console.log(`inject ${injectToken} to ${thisToken}`);
                Object.defineProperty(this, context.name, {
                    get: () => {
                        if (!DIContext[injectToken]) {
                            const constructorArgumentsLength = (clazz as any).__constructorArgumentsLength as number;
                            if (constructorArgumentsLength>0) {
                                throw new Error(`can not inject ${injectToken}: constructor without arguments is not provided`);
                            }
                            DIContext[injectToken] = new clazz();
                        }
                        return DIContext[injectToken];
                    },
                    set: val => {
                        // pass
                    }
                });
            });
        };
    },
}
