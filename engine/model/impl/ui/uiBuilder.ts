

import {Game} from "../../../core/game";
import * as allUIClasses from './all';
import {Container} from "./generic/container";
import {DebugError} from "../../../debugError";
import {AbsoluteLayout} from "./layouts/absoluteLayout";
import {isObject} from "../../../core/misc/object";
import {Clazz} from "../../../core/misc/clazz";



interface UIDescription {
    [key:string]:any
}

export class UIBuilder {

    private readonly game:Game;
    private _components:{[key:string]:Clazz<Container>} = {};

    constructor(game: Game) {
        this.game = game;
        Object.keys(allUIClasses).forEach((key:string)=>{
            this.registerComponent(key,allUIClasses[key]);
        });
    }

    public registerComponent(key:string,component:Clazz<Container>){
        this._components[key] = component;
    }

    private static _normalizeSetterName(name:string):string{
        return `set${name[0].toUpperCase()}${name.substr(1)}`;
    }

    private static _getFirstKey(desc:UIDescription):string{
        if (!isObject(desc)) return undefined;
        return Object.keys(desc)[0];
    }

    private static _getAllKeys(desc:UIDescription):string[]{
        return Object.keys(desc);
    }

    private static _getKeysLength(desc:UIDescription):number{
        return UIBuilder._getAllKeys(desc).length;
    }

    private _resolveProperties(instance:Container,desc:UIDescription,appendChildren:boolean) {

        UIBuilder._getAllKeys(desc).forEach((propName:string)=>{

            if (propName==='children') {
                if (!desc.children.splice) throw new DebugError(`'children' property must be an array`);
                desc.children.forEach((descChild: UIDescription) => {
                    let key = UIBuilder._getFirstKey(descChild);
                    let Cl: Clazz<Container> = this._components[key] as Clazz<Container>;
                    let child: Container = new Cl(this.game);
                    this._resolveProperties(child, descChild[key],true);
                    instance.appendChild(child);
                });
                return;
            }

            else if (this._components[propName]) {
                let Cl:Clazz<Container> = this._components[propName] as Clazz<Container>;
                let child:Container;
                if (appendChildren) child = new Cl(this.game);
                else child = instance;
                this._resolveProperties(child,desc[propName],appendChildren);
                if (appendChildren) instance.appendChild(child);
            } else {
                let setterName = UIBuilder._normalizeSetterName(propName);
                let hasProperty:boolean = propName in instance;
                let hasSetter:boolean = setterName in instance;
                if (DEBUG && !hasProperty && !hasSetter) {
                    let constructorName = (instance.constructor && instance.constructor.name) || instance.type || '';
                    throw new DebugError(`uiBuilder error: object ${constructorName} has not property ${propName} not associated setter ${setterName}`);
                }
                if (this._components[UIBuilder._getFirstKey(desc[propName])]) {
                    let PropClass = this._components[UIBuilder._getFirstKey(desc[propName])];
                    let propInstance = new PropClass(this.game);
                    this._resolveProperties(propInstance,desc[propName],false);
                    desc[propName] = propInstance;
                }

                if (hasSetter) {
                    let args = desc[propName];
                    if (!args.splice) args = [desc[propName]];
                    instance[setterName].apply(instance,args);
                }
                else {

                    if (desc[propName].type) {
                        let Cl:Clazz<Container> = this._components[desc[propName].type] as Clazz<Container>;
                        if (!Cl) throw new DebugError(`unknown type: ${desc[propName].type}`);
                        instance[propName] = new Cl(this.game);
                    }

                    if (instance[propName] && instance[propName].fromJSON) {
                        instance[propName].fromJSON(desc[propName]);
                    }
                    else if (instance[propName] && instance[propName].apply) {
                        let args = desc[propName];
                        if (!args.splice) args = [args];
                        instance[propName].apply(instance,args);
                    }
                    else {
                        instance[propName] = desc[propName];
                    }
                }
            }
        });
        instance.revalidate();
    }

    build(desc:UIDescription):Container{
        if (DEBUG && UIBuilder._getKeysLength(desc)>1)
            throw new DebugError(`only one root element is supported. Found: ${UIBuilder._getAllKeys(desc)}`);
        let firstKey:string = UIBuilder._getFirstKey(desc);
        let Cl:Clazz<Container> = this._components[firstKey] as Clazz<Container>;
        if (DEBUG && !Cl) throw new DebugError(`no such ui class: ${firstKey}`);
        let instance:Container = new Cl(this.game);
        this._resolveProperties(instance,desc[firstKey],true);
        (instance as AbsoluteLayout).testLayout();
        (window as any).l = instance;
        return instance;
    }

}

