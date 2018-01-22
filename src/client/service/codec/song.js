import * as Parser from './parser'

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
    artwork: Parser.file(object.artwork),
    length: object.length,
    bitrate: object.bitrate,
    link: object.webUrl,
    mvLink: object.mvWebUrl,
    files: Parser.file(object.musics, true),
    mvFile: Parser.file(object.mv),
    lyrics: Parser.lyrics(object.lyrics)
  }
}
