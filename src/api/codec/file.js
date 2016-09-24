export function encode(object = {}) {
    return object
}

export function decode(object = {}, useCdn) {
  if (!object) return null
  const {file, fileViaCdn} = object
  let ret = file
  if (useCdn && fileViaCdn) ret = fileViaCdn
  return ret
}
