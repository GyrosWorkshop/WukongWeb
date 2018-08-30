import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {Action} from '../client'
import ButtonItem from './button-item'

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

export default
@connect(mapStateToProps, mapDispatchToProps)
class SilenceButton extends PureComponent {
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
      <ButtonItem icon={listenOnly ? 'user-secret' : 'user'}
        action={this.onButtonAction}>
        <p>Listen Only: {listenOnly ? 'On' : 'Off'}</p>
      </ButtonItem>
    )
  }
}
