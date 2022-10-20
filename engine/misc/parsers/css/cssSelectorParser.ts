
export class CssSelectorParser {
    //var tokens = subselector.split(/(?=\.)|(?=#)|(?=\[)/)

    private selectorToSubSelector = /(\s?[ +~>]\s?)/;

    public compile(selector:string):void {
        selector = selector.trim();
        selector = selector.replace(/  +/g, ' ');
        const parsed =
            selector.split(this.selectorToSubSelector).
            map(it=>{
                if (it===' ') return it;
                return it.trim();
            });
        console.log(parsed);
        // const selectors:string[] = [];
        // for (let i = 0; i < parsed.length; i++) {
        //     const s = parsed[i];
        //     if (s===' ' && parsed[i-1]==='') continue;
        //     if (s!=='') selectors.push(s);
        // }
        // console.log(selectors);
    }


}
