export function encode(object = {}) {
  return {
    siteId: object.siteId,
    songId: object.songId
  }
}

export function decode(object = {}) {
  const parseLyrics = lyrics => {
    if (!lyrics) return
    const lrcItems = lyrics
      .filter(item => item.withTimeline)
      .sort((item1, item2) => item1.translate - item2.translate)
    if (!lrcItems.length) return
    const lrcText = (lrcItems[0].lyric || '').split('\n').join(' ')
    if (!lrcText.length) return
    const metadata = {}
    const lines = []
    for (let string = lrcText; string;) {
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
  }
  return {
    id: `${object.siteId}.${object.songId}`,
    siteId: object.siteId,
    songId: object.songId,
    title: object.title,
    album: object.album,
    artist: object.artist,
    artwork: object.artwork,
    file: object.file,
    length: object.length,
    lyrics: parseLyrics(object.lyrics)
  }
}
