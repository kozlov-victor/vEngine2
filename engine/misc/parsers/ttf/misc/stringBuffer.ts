
export class StringBuffer {
    private res = '';

    public append(s:string|number):this {
        this.res+=`${s}`;
        return this;
    }

    public toString() {
        return this.res;
    }

    public length() {
        return this.res.length;
    }

    public charAt(i:number):string {
        return this.res[i];
    }

    public setCharAt(i:number, ch: string):void {
        this.res = this.replaceAt(this.res,i,ch);
    }

    private replaceAt = function(src:string, index: number, replacement: string) {
        return src.substring(0, index) + replacement + src.substring(index + replacement.length);
    }

}
