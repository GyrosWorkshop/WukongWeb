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
    if (!lrcItems) return
    const lrcText = lrcItems[0].lyric || ''
    const metadata = {}
    const lines = []
    lrcText.split('\n').forEach(line => {
      const match = line.trim().match(/^\[(.*?):(.*?)](.*)$/)
      if (!match) return
      const parts = match.slice(1, 4)
      if (isNaN(parseInt(parts[0])) || isNaN(parseFloat(parts[1]))) {
        metadata[parts[0]] = parts[1]
      } else {
        lines.push({
          time: parseInt(parts[0]) * 60 + parseFloat(parts[1]),
          text: parts[2]
        })
      }
    })
    if (metadata.offset) {
      const offset = parseFloat(metadata.offset)
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
