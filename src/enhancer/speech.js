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
              say(`欢迎我们的老伙计，${nicknames.join('和')}来到悟空${name}房间。`)
            }
          } else {
            const nicknames = prevMembers.filter(prevMember =>
              !members.find(member => member.id == prevMember.id)
            ).map(member => member.nickname)
            if (nicknames.length) {
              say(`噢，${nicknames.join('和')}离开了悟空，我向上帝保证，这简直是糟透了。`)
            }
          }
        } else {
          say(`嘿，${profile.nickname}，见到你真是太令人高兴了。`)
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
