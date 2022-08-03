
export namespace path {

    const trimStart = (part:string):string=>{
        if (part.startsWith('./')) part = part.substr(2);
        else if (part.startsWith('/')) part = part.substr(1);
        return part;
    }

    const trimEnd = (part:string):string=>{
        if (part.endsWith('/')) part = part.substr(0,part.length-1);
        return part;
    }

    export const join = (...parts:string[]):string=> {
        for (let i = 0; i < parts.length; i++) {
            parts[i] = trimStart(parts[i]);
            if (i!==parts.length-1) parts[i] = trimEnd(parts[i]);
        }
        return `./${parts.filter(it=>it.length>0).join('/')}`;
    }

}
