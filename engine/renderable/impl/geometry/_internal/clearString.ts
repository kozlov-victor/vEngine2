
export const clearString = (s:string):string=>{
  return s.replace(/\s\s+/g, ' ').trim();
};
