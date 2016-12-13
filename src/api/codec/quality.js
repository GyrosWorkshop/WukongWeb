const definedQualityTags = ['', 'low', 'medium', 'high', 'lossless']

export function encode(object) {
  return definedQualityTags[object]
}

export function decode(object) {
  return definedQualityTags.indexOf(object)
}