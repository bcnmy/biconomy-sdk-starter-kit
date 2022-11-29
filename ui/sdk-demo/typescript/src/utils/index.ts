export function toFixed(num: number, fixed: number): number | undefined {
    if(num != null) {
        return Math.trunc(num*Math.pow(10, fixed))/Math.pow(10, fixed);
    }
}