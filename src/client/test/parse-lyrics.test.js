import {lyrics as parseLyrics} from '../service/codec/parser'

describe('parse invalid lyrics', () => {
  test('with invalid object', () => {
    expect(parseLyrics()).toBeUndefined()
    expect(parseLyrics({})).toBeUndefined()
    expect(parseLyrics([])).toEqual([])
    expect(parseLyrics([{}])).toEqual([])
  })

  test('with invalid data', () => {
    const input = (data) => [{
      lrc: true,
      translated: false,
      data: data
    }]
    const output = []
    expect(parseLyrics(input(''))).toEqual(output)
    expect(parseLyrics(input(' '))).toEqual(output)
    expect(parseLyrics(input('\\'))).toEqual(output)
    expect(parseLyrics(input('aaa'))).toEqual(output)
    expect(parseLyrics(input('[aaa]bbb'))).toEqual(output)
  })
})

describe('parse mock lyrics', () => {
  test('non-lrc is ignored', () => {
    const input = [{
      lrc: true,
      translated: false,
      data: '[00:00.00]aaa'
    }, {
      lrc: false,
      translated: false,
      data: '[00:00.00]bbb'
    }]
    const output = [[
      {time: 0, text: 'aaa'}
    ]]
    expect(parseLyrics(input)).toEqual(output)
  })

  test('original comes first', () => {
    const input = [{
      lrc: true,
      translated: true,
      data: '[00:00.00]bbb'
    }, {
      lrc: true,
      translated: false,
      data: '[00:00.00]aaa'
    }]
    const output = [[
      {time: 0, text: 'aaa'}
    ], [
      {time: 0, text: 'bbb'}
    ]]
    expect(parseLyrics(input)).toEqual(output)
  })

  test('sort by time', () => {
    const input = [{
      lrc: true,
      translated: false,
      data: '[00:01.00] bbb [00:00.00] aaa'
    }]
    const output = [[
      {time: 0, text: 'aaa'},
      {time: 1, text: 'bbb'}
    ]]
    expect(parseLyrics(input)).toEqual(output)
  })

  test('handle repeated text', () => {
    const input = [{
      lrc: true,
      translated: false,
      data: '[00:00.00] [00:01.00] aaa'
    }]
    const output = [[
      {time: 0, text: 'aaa'},
      {time: 1, text: 'aaa'}
    ]]
    expect(parseLyrics(input)).toEqual(output)
  })
})

describe('parse real lyrics', () => {
  test('song 迷い子さがし by 中原麻衣', () => {
    const input = [{
      lrc: true,
      translated: false,
      data: [
        '[00:00.00] 作曲 : 伊藤真澄',
        '[00:00.00] 作词 : 畑亜貴',
        '[00:00.00]',
        '[00:01.00]',
        '[00:14.560]おいで  たんたん  たん',
        '[00:16.840]答えをすぐに教えてあげる',
        '[00:27.980]激しくすべてを還す',
        '[00:35.220]',
        '[00:39.750]やがて  とんとん  とん',
        '[00:42.190]開いた悲劇迎えるでしょう',
        '[00:51.0]やっとしずかに',
        '[00:53.820]やっと彼岸へと  しずかに',
        '[01:00.920]',
        '[01:02.360]闇  ほどけて  唄  ながれて',
        '[01:07.950]迷子のからだみないでね',
        '[01:13.680]闇  つれづれ  唄  ほれぼれと',
        '[01:20.950]最後にだれかをみていた',
        '[01:33.630]',
        '[02:15.620]',
        '[02:18.620]うまれ  てんてん  てん',
        '[02:20.970]歩いた意味を忘れていたい',
        '[02:29.880]とまれ  てん  てんてん',
        '[02:32.329]戻ればすべては嘘に',
        '[02:39.290]',
        '[02:44.160]そして  とんとん  とん',
        '[02:46.480]答えはすぐと教えてあげる',
        '[02:55.260]そっといのちを',
        '[02:58.300]そっと火を消した  いのちの',
        '[03:05.120]',
        '[03:06.640]夢  やぶれて  羽  ちぎれて',
        '[03:12.250]無惨がひとの性(さが)でしょう',
        '[03:17.720]夢  ひとひら  羽  それぞれの',
        '[03:25.280]最後があるのね',
        '[03:33.780]最後をみていた',
        '[03:42.770]',
        '[04:10.660]',
        ''
      ].join('\n')
    }, {
      lrc: true,
      translated: true,
      data: [
        '[by:nibor_ocin]',
        '[00:00.00]',
        '[00:01.00]',
        '[00:14.560]快过来 哒哒哒',
        '[00:16.840]我想立刻把答案告诉你',
        '[00:27.980]我想毫无保留地把一切交付你',
        '[00:39.750]终于 咚咚咚',
        '[00:42.190]门扉轻启 迎面而来的也许是悲剧吧',
        '[00:51.0]却 终于能够沉静了',
        '[00:53.820]终于能够朝着彼岸 平静地前行',
        '[01:02.360]阴霾散去 歌声沁耳',
        '[01:07.950]迷路的孩子啊 请不要注视我的身影',
        '[01:13.680]迷惑沉澱 歌声醉人',
        '[01:20.950]彼岸末途 有一个人让你静静凝眸',
        '[02:18.620]诞生了 噔噔噔',
        '[02:20.970]想忘却前进的意义',
        '[02:29.880]止步了 噔噔噔',
        '[02:32.329]若退回就一切都成谎言',
        '[02:44.160]然后 咚咚咚',
        '[02:46.480]我想立刻把答案告诉你',
        '[02:55.260]悄悄地',
        '[02:58.300]熄灭了生命之火',
        '[03:06.640]梦想的羽翼被撕裂',
        '[03:12.250]这就是人性的悲惨吧',
        '[03:17.720]每个梦想都有羽翼',
        '[03:25.280]最后却都不在了',
        '[03:33.780]我一直在寻找，直到最后',
        ''
      ].join('\n')
    }]
    const output = [[
      {time: 0, text: '作曲 : 伊藤真澄'},
      {time: 0, text: '作词 : 畑亜貴'},
      {time: 0, text: 'おいで  たんたん  たん'},
      {time: 1, text: 'おいで  たんたん  たん'},
      {time: 14.56, text: 'おいで  たんたん  たん'},
      {time: 16.84, text: '答えをすぐに教えてあげる'},
      {time: 27.98, text: '激しくすべてを還す'},
      {time: 35.22, text: 'やがて  とんとん  とん'},
      {time: 39.75, text: 'やがて  とんとん  とん'},
      {time: 42.19, text: '開いた悲劇迎えるでしょう'},
      {time: 51, text: 'やっとしずかに'},
      {time: 53.82, text: 'やっと彼岸へと  しずかに'},
      {time: 60.92, text: '闇  ほどけて  唄  ながれて'},
      {time: 62.36, text: '闇  ほどけて  唄  ながれて'},
      {time: 67.95, text: '迷子のからだみないでね'},
      {time: 73.68, text: '闇  つれづれ  唄  ほれぼれと'},
      {time: 80.95, text: '最後にだれかをみていた'},
      {time: 93.63, text: 'うまれ  てんてん  てん'},
      {time: 135.62, text: 'うまれ  てんてん  てん'},
      {time: 138.62, text: 'うまれ  てんてん  てん'},
      {time: 140.97, text: '歩いた意味を忘れていたい'},
      {time: 149.88, text: 'とまれ  てん  てんてん'},
      {time: 152.329, text: '戻ればすべては嘘に'},
      {time: 159.29, text: 'そして  とんとん  とん'},
      {time: 164.16, text: 'そして  とんとん  とん'},
      {time: 166.48, text: '答えはすぐと教えてあげる'},
      {time: 175.26, text: 'そっといのちを'},
      {time: 178.3, text: 'そっと火を消した  いのちの'},
      {time: 185.12, text: '夢  やぶれて  羽  ちぎれて'},
      {time: 186.64, text: '夢  やぶれて  羽  ちぎれて'},
      {time: 192.25, text: '無惨がひとの性(さが)でしょう'},
      {time: 197.72, text: '夢  ひとひら  羽  それぞれの'},
      {time: 205.28, text: '最後があるのね'},
      {time: 213.78, text: '最後をみていた'},
      {time: 222.77, text: ''},
      {time: 250.66, text: ''}
    ], [
      {time: 0, text: '快过来 哒哒哒'},
      {time: 1, text: '快过来 哒哒哒'},
      {time: 14.56, text: '快过来 哒哒哒'},
      {time: 16.84, text: '我想立刻把答案告诉你'},
      {time: 27.98, text: '我想毫无保留地把一切交付你'},
      {time: 39.75, text: '终于 咚咚咚'},
      {time: 42.19, text: '门扉轻启 迎面而来的也许是悲剧吧'},
      {time: 51, text: '却 终于能够沉静了'},
      {time: 53.82, text: '终于能够朝着彼岸 平静地前行'},
      {time: 62.36, text: '阴霾散去 歌声沁耳'},
      {time: 67.95, text: '迷路的孩子啊 请不要注视我的身影'},
      {time: 73.68, text: '迷惑沉澱 歌声醉人'},
      {time: 80.95, text: '彼岸末途 有一个人让你静静凝眸'},
      {time: 138.62, text: '诞生了 噔噔噔'},
      {time: 140.97, text: '想忘却前进的意义'},
      {time: 149.88, text: '止步了 噔噔噔'},
      {time: 152.329, text: '若退回就一切都成谎言'},
      {time: 164.16, text: '然后 咚咚咚'},
      {time: 166.48, text: '我想立刻把答案告诉你'},
      {time: 175.26, text: '悄悄地'},
      {time: 178.3, text: '熄灭了生命之火'},
      {time: 186.64, text: '梦想的羽翼被撕裂'},
      {time: 192.25, text: '这就是人性的悲惨吧'},
      {time: 197.72, text: '每个梦想都有羽翼'},
      {time: 205.28, text: '最后却都不在了'},
      {time: 213.78, text: '我一直在寻找，直到最后'}
    ]]
    expect(parseLyrics(input)).toEqual(output)
  })
})
