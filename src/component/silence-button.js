import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import Action from '../action'
import FlatButton from './flat-button'

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
      <FlatButton icon={listenOnly ? 'user-secret' : 'user'}
        action={this.onButtonAction}>
        <p>Listen Only: {listenOnly ? 'On' : 'Off'}</p>
      </FlatButton>
    )
  }
}
