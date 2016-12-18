import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../../action'
import style from './index.sss'

function mapStateToProps(state) {
  return {
    channel: state.channel.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exitChannel() {
      dispatch(Action.Channel.name.create(''))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Channel extends Component {
  static propTypes = {
    channel: PropTypes.string,
    exitChannel: PropTypes.func
  }

  onExitAction = (event) => {
    this.props.exitChannel()
  }

  render() {
    return (
      <div>
        <p>Channel: {this.props.channel}</p>
        <a href='#' onTouchTap={this.onExitAction}>Exit</a>
        {!this.props.channel &&
          <Redirect to={{pathname: '/'}}/>}
      </div>
    )
  }
}
