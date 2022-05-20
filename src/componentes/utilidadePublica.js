
export function ObjIsEmpty(o) { return Object.keys(o).length === 0 }
export function ObjIsEquivalent(a, b) {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) return false;

    for (let i = 0; i < aProps.length; i++) {
        if (a[aProps[i]] !== b[aProps[i]]) {
            return false;
        }
    }
    return true;
}
export const ArrayCompare = (lista1, lista2) => {
    let teste = true;
    if(!Array.isArray(lista1)) {
        return null
    }
    if(!Array.isArray(lista2)){
        return null
    } 
    for (let i = 0; i < lista1.length; i++) {
        if (lista1[i] !== lista2[i]) {
            teste = false
            break
        }
    }
    if (teste) {

        for (let i = 0; i < lista2.length; i++) {
            if (lista1[i] !== lista2[i]) {
                teste = false
                break
            }
        }
    }
    return teste
}