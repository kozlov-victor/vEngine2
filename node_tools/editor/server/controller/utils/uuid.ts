
let cnt = 0;
const rnd = ()=>{
    return '0123456789abcdef'.split('').sort(it=>Math.random()>0.5?-1:1)[0];
}

export const uuid = ()=>{
    let res = '';
    for (let i=0;i<16;i++) {
        res+=rnd();
    }
    cnt++;
    res+=cnt;
    return res;
}
