export function encode(object = {}) {
  return {
    siteId: object.siteId,
    songId: object.songId
  }
}

export function decode(object = {}) {
  const parseLyrics = (lyricsText) => {
    let lyrcArr = []
    let lyrics  = []

    if (lyricsText) {
      // filter lyrics, get the original one, should be with timeline.
      let originalLyric = lyricsText
        .filter(v => v.withTimeline && !v.translate)
        || lyricsText
        .filter(v => v.withTimeline)

      if (originalLyric.length > 0)
        lyrcArr = originalLyric[0].lyric.split('\n')
    }
    const reg = /\[\d+:\d+\.\d+\]/g

    lyrcArr.forEach(line => {
      let res  = line.match(reg)
      let lyrc = line.replace(reg, '')

      if (res) {
        res.forEach(key => {
          let min      = Number(String(key.match(/\[\d+/)).slice(1))
          let sec      = Number(String(key.match(/\:\d+/)).slice(1))
          let millisec = Number(String(key.match(/\.\d+/)))
          let time = min * 60 + sec + millisec
          lyrics.push({
            time,
            lyrc
          })
        })
      }
    })
    if (lyrics.length > 0) {
      // If we have lyrics, display the title of song before playing.
      lyrics.push({
        time: -1,
        lyrc: `${object.title} - ${object.artist}`
      })
    }
    // sort lyric lines by time order
    lyrics = lyrics.sort((a, b) => a.time - b.time)

    return lyrics
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
    bitrate: object.bitrate,
    lyrics: parseLyrics(object.lyrics)
  }
}
