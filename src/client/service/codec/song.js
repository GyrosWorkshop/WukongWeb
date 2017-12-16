export function encode(object = {}) {
  return {
    siteId: object.siteId,
    songId: object.songId
  }
}

export function decode(object = {}) {
  return {
    id: `${object.siteId}.${object.songId}`,
    siteId: object.siteId,
    songId: object.songId,
    title: object.title,
    album: object.album,
    artist: object.artist,
    artwork: parseFile(object.artwork),
    length: object.length,
    bitrate: object.bitrate,
    link: object.webUrl,
    mvLink: object.mvWebUrl,
    files: parseFile(object.musics, true),
    mvFile: parseFile(object.mv),
    lyrics: parseLyrics(object.lyrics)
  }
}

function parseFile(file, multiple) {
  if (!file) return
  if (multiple) return file.map(item => parseFile(item))
  if (!file.file) return
  const urls = [
    file.file,
    file.fileViaCdn || file.file
  ]
  if (!file.format) return {urls}
  const format = file.format
  const quality = file.audioQuality && {
    level: ['low', 'medium', 'high', 'lossless'].indexOf(file.audioQuality),
    description: `${file.audioQuality} (${file.audioBitrate / 1000}kbps)`
  }
  return {urls, format, quality}
}

function parseLyrics(lyrics) {
  if (!lyrics) return
  const items = lyrics
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
