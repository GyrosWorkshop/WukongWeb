import {file as parseFile} from '../service/codec/parser'

test('parse invalid file', () => {
  expect(parseFile()).toBeUndefined()
  expect(parseFile({})).toBeUndefined()
  expect(parseFile({}, false)).toBeUndefined()
  expect(parseFile({}, true)).toEqual([])
  expect(parseFile([{}])).toBeUndefined()
  expect(parseFile([{}], false)).toBeUndefined()
  expect(parseFile([{}], true)).toEqual([])
})

test('parse single file without cdn url and format data', () => {
  const input = {
    file: 'http://www.example.com/file.js'
  }
  const output = {
    urls: [
      'http://www.example.com/file.js',
      'http://www.example.com/file.js'
    ]
  }
  expect(parseFile(input)).toEqual(output)
})

test('parse single file with cdn url but without format data', () => {
  const input = {
    audioQuality: null,
    audioBitrate: 0,
    format: null,
    file: 'http://www.example.com/artwork.jpg',
    fileViaCdn: 'http://cdn.example.com/artwork.jpg',
    unavailable: false
  }
  const output = {
    urls: [
      'http://www.example.com/artwork.jpg',
      'http://cdn.example.com/artwork.jpg'
    ]
  }
  expect(parseFile(input, false)).toEqual(output)
})

test('parse multiple files with cdn url and format data', () => {
  const input = [{
    audioQuality: 'high',
    audioBitrate: 320000,
    format: 'mp3',
    file: 'http://www.example.com/song-high.mp3',
    fileViaCdn: 'http://cdn.example.com/song-high.mp3',
    unavailable: false
  }, {
    audioQuality: 'low',
    audioBitrate: 128000,
    format: 'mp3',
    file: 'http://www.example.com/song-low.mp3',
    fileViaCdn: 'http://cdn.example.com/song-low.mp3',
    unavailable: false
  }]
  const output = [{
    format: 'mp3',
    quality: {
      description: 'high (320kbps)',
      level: 2
    },
    urls: [
      'http://www.example.com/song-high.mp3',
      'http://cdn.example.com/song-high.mp3'
    ]
  }, {
    format: 'mp3',
    quality: {
      description: 'low (128kbps)',
      level: 0
    },
    urls: [
      'http://www.example.com/song-low.mp3',
      'http://cdn.example.com/song-low.mp3'
    ]
  }]
  expect(parseFile(input, true)).toEqual(output)
})
