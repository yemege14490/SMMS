export function pwdreg(value){
    var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
    return reg.test(value)
}