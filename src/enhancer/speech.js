import {applyMiddleware} from 'redux'

import {Action} from '../client'

export default applyMiddleware(
  ({getState, dispatch}) => (next) => (action) => {
    const prevState = getState()
    next(action)
    const state = getState()
    switch (action.type) {
      case Action.Channel.members.type: {
        const {user: {profile}, channel: {name, members}} = state
        const {members: prevMembers} = prevState.channel
        if (prevMembers.length) {
          if (members.length >= prevMembers.length) {
            const nicknames = members.filter(member =>
              !prevMembers.find(prevMember => member.id == prevMember.id)
            ).map(member => member.nickname)
            if (nicknames.length) {
              say({
                'zh-CN': [
                  '欢迎我们的老伙计，',
                  `${nicknames.join('和')}来到悟空${name}房间。`
                ].join(''),
                'en-US': [
                  'huan ying wo men de lao hoh ji,',
                  `${nicknames.join(' hur ')} lie dao`,
                  `wu kong ${name} fang jian.`
                ].join(' ')
              })
            }
          } else {
            const nicknames = prevMembers.filter(prevMember =>
              !members.find(member => member.id == prevMember.id)
            ).map(member => member.nickname)
            if (nicknames.length) {
              say({
                'zh-CN': [
                  `噢，${nicknames.join('和')}离开了悟空，`,
                  '我向上帝保证，',
                  '这简直是糟透了。'
                ].join(''),
                'en-US': [
                  `oh, ${nicknames.join(' hur ')} lee kai lur wu kong,`,
                  'wo xiang shang dee bow zheng,',
                  'zhe jian zhi shee zao toe leh.'
                ].join(' ')
              })
            }
          }
        } else {
          say({
            'zh-CN': [
              `嘿，${profile.nickname}，`,
              '见到你真是太令人高兴了。'
            ].join(''),
            'en-US': [
              `hey, ${profile.nickname},`,
              'jian dao ni zhen shee tie ling reng gao xing leh.'
            ].join(' ')
          })
        }
        break
      }
    }
  }
)

const say = (() => {
  if (window.speechSynthesis) {
    let voice
    const selectVoice = () => {
      const keySorter = (key, values) => (object) =>
        values.concat('').findIndex(value => object[key].includes(value))
      const langSort = keySorter('lang', ['zh-CN', 'en-US'])
      const uriSort = keySorter('voiceURI', ['Google', 'Microsoft'])
      voice = speechSynthesis.getVoices().sort((voice1, voice2) => {
        const lang1 = langSort(voice1), lang2 = langSort(voice2)
        const uri1 = uriSort(voice1), uri2 = uriSort(voice2)
        if (lang1 != lang2) return lang1 - lang2
        if (uri1 != uri2) return uri1 - uri2
        return 0
      })[0]
    }
    selectVoice()
    speechSynthesis.onvoiceschanged = selectVoice
    return (texts) => {
      if (!voice) return
      const text = texts[voice.lang]
      if (!text) return
      const utterance = new SpeechSynthesisUtterance()
      utterance.voice = voice
      utterance.text = text
      speechSynthesis.speak(utterance)
    }
  } else {
    return () => {}
  }
})()
