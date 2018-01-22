export function file(object, multiple) {
  if (!object) return
  if (multiple) return object.map(item => file(item))
  if (!object.file) return
  const urls = [
    object.file,
    object.fileViaCdn || object.file
  ]
  if (!object.format) return {urls}
  const format = object.format
  const quality = object.audioQuality && {
    level: ['low', 'medium', 'high', 'lossless'].indexOf(object.audioQuality),
    description: `${object.audioQuality} (${object.audioBitrate / 1000}kbps)`
  }
  return {urls, format, quality}
}

export function lyrics(object) {
  if (!object) return
  const items = object
    .filter(item => item.data && item.lrc)
    .sort((item1, item2) => item1.translated - item2.translated)
  if (!items.length) return
  return items.map(item => {
    const metadata = {}
    const lines = []
    for (let string = item.data.split(/[\n\r]/).join(' '); string;) {
      const times = []
      for (let match; (match = string.match(/^\s*\[(.*?):(.*?)]/));) {
        const data = match.slice(1, 3)
        if (isNaN(parseInt(data[0])) || isNaN(parseFloat(data[1]))) {
          metadata[data[0]] = data[1]
        } else {
          times.push(parseInt(data[0]) * 60 + parseFloat(data[1]))
        }
        string = string.substr(match[0].length)
      }
      const match = string.match(/^(\s*(.*?)\s*)(\[.*?:.*?]|$)/)
      const text = match[2]
      times.forEach(time => lines.push({time, text}))
      string = string.substr(match[1].length)
    }
    if (metadata.offset) {
      const offset = parseFloat(metadata.offset) / 1000
      lines.forEach(line => line.time += offset)
    }
    lines.sort((line1, line2) => line1.time - line2.time)
    return lines
  })
}
