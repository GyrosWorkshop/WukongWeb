import {applyMiddleware} from 'redux'

import {Action} from '../client'

export default applyMiddleware(
  ({getState, dispatch}) => (next) => (action) => {
    const prevState = getState()
    next(action)
    const state = getState()
    switch (action.type) {
      case Action.Channel.members.type: {
        const prevMembers = prevState.channel.members
        const nicknames = []
        if (prevMembers.length) {
          state.channel.members.forEach(member1 => {
            if (!prevMembers.find(member2 => member1.id == member2.id)) {
              nicknames.push(member1.nickname)
            }
          })
        } else {
          nicknames.push(state.user.profile.nickname)
        }
        if (nicknames.length) {
          say(`欢迎${nicknames.join('和')}进入悟空`)
        }
        break
      }
    }
  }
)

function say(text) {
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = text
    utterance.lang = 'zh-CN'
    speechSynthesis.speak(utterance)
  }
}
