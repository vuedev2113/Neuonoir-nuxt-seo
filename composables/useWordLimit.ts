export const useWordLimit = (text:string, amount:number) => {
    const expString = text.split(/\s+/,amount);
    return expString.join(" ") + " ...";
}