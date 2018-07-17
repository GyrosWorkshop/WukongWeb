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
              say([
                'huan ying wo men de lao hoh ji,',
                `${nicknames.join(' hur ')} lie dao`,
                `wu kong ${name} fang jian.`
              ].join(' '))
            }
          } else {
            const nicknames = prevMembers.filter(prevMember =>
              !members.find(member => member.id == prevMember.id)
            ).map(member => member.nickname)
            if (nicknames.length) {
              say([
                `oh, ${nicknames.join(' hur ')} lee kai lur wu kong,`,
                'wo xiang shang dee bow zheng,',
                'zhe jian zhi shee zao toe leh.'
              ].join(' '))
            }
          }
        } else {
          say([
            `hey, ${profile.nickname},`,
            'jian dao ni zhen shee tie ling reng gao xing leh.'
          ].join(' '))
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
        values.concat('').findIndex(value =>
          object[key].toLowerCase().includes(value.toLowerCase()))
      const sorters = [
        keySorter('lang', ['en-US', 'en']),
        keySorter('voiceURI', ['Google', 'Microsoft', 'Alex'])
      ]
      voice = speechSynthesis.getVoices().sort((voice1, voice2) => {
        for (const sorter of sorters) {
          const result = sorter(voice1) - sorter(voice2)
          if (result != 0) return result
        }
        return 0
      })[0]
    }
    selectVoice()
    speechSynthesis.onvoiceschanged = selectVoice
    return (text) => {
      if (!voice || !text) return
      const utterance = new SpeechSynthesisUtterance()
      utterance.voice = voice
      utterance.text = text
      speechSynthesis.speak(utterance)
    }
  } else {
    return () => {}
  }
})()
