type Constructor<T = Record<any, any>> = new (...args: any[]) => T;
const DIContext:Record<string, any> = {};


export const DI = {
    registerInstance: (instance:any):void=>{
        const tkn = instance.constructor.name;
        DIContext[tkn] = instance;
    },
    Injectable: ()=> {
        return function ClassDecorator<C extends Constructor>(
            target: C,
            ctx: ClassDecoratorContext,
        ) {
            return class extends target {
                public static __injectable = target.name;
                public static __constructorArgumentsLength = target.length;
                public __postConstruct: (()=>void)|undefined = undefined;
                public __injected:(string[])|undefined = undefined;
                constructor(...args: any[]) {
                    super(...args);
                    DIContext[target.name] = this;
                    setTimeout(()=>{
                        if (!(this as any).__postConstruct) {
                            return;
                        }
                        const allFieldsInjected = (this as any).__injected ?? [];
                        for (const prop of allFieldsInjected) {
                            try {
                                const val = (this as any)[prop];
                                if (!val) {
                                    console.error(this);
                                    console.error(`injection error for token ${prop}`);
                                }
                            } catch (e) {
                                console.error(e);
                                console.error(this);
                                console.error(`injection error for token ${prop}`);
                            }

                        }
                        (this as any).__postConstruct.apply(this);
                    },1);
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
                if (!(this as any).constructor.__injectable) {
                    console.error(this);
                    throw new Error(`not injectable: ${(this as any).constructor.name}`)
                }
                const tkn = (clazz as any).__injectable ?? clazz.name;
                if (!tkn) {
                    throw new Error(`not injectable: consider adding @Injectable() decorator to class ${clazz.name}`);
                }
                (this as any).__injected ??= [];
                (this as any).__injected.push(context.name);
                Object.defineProperty(this, context.name, {
                    get: () => {
                        if (!DIContext[tkn]) {
                            const constructorArgumentsLength = (clazz as any).__constructorArgumentsLength as number;
                            if (constructorArgumentsLength>0) {
                                throw new Error(`can not inject ${tkn}: constructor without arguments is not provided`);
                            }
                            DIContext[tkn] = new clazz();
                        }
                        return DIContext[tkn];
                    },
                    set: val => {
                        // pass
                    }
                });
            });
        };
    },
    PostConstruct: function() {
        return (originalMethod:any,context:ClassMethodDecoratorContext) => {
            context.addInitializer(function(){
                (this as any).__postConstruct = originalMethod;
            });
        };
    }
}
