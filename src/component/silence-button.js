import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import style from './silence-button.css'

function mapStateToProps(state) {
  return {
    listenOnly: state.user.preferences.listenOnly
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchListenOnly(listenOnly) {
      dispatch(Action.User.preferences.create({listenOnly}))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class SilenceButton extends PureComponent {
  static propTypes = {
    listenOnly: PropTypes.bool,
    dispatchListenOnly: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchListenOnly(!this.props.listenOnly)
  }

  render() {
    const {listenOnly} = this.props
    return (
      <ButtonItem icon={listenOnly ? 'microphone-slash' : 'microphone'}
        action={this.onButtonAction}/>
    )
  }
}
