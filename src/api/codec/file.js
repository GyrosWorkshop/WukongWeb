export function encode(object = {}) {
    return object
}

export function decode(object = {}) {
    if (!object) return null
    const {useCdn, file, fileViaCdn} = object
    let ret = file
    if (useCdn && fileViaCdn) ret = fileViaCdn
    return ret
}
