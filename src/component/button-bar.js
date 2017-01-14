import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import style from './button-bar.css'

function mapStateToProps(state) {
  return {
    running: state.player.running,
    downvote: state.player.downvote
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchReload() {
      dispatch(Action.Player.reload.create(true))
    },
    dispatchDownvote() {
      dispatch(Action.Player.downvote.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ReloadButton extends PureComponent {
  static propTypes = {
    running: PropTypes.bool,
    downvote: PropTypes.bool,
    dispatchReload: PropTypes.func,
    dispatchDownvote: PropTypes.func
  }

  onReloadAction = (event) => {
    this.props.dispatchReload()
  }

  onDownvoteAction = (event) => {
    this.props.dispatchDownvote()
  }

  render() {
    const {running, downvote} = this.props
    return (
      <div styleName='container'>
        <ButtonItem icon='refresh' hidden={running}
          action={this.onReloadAction}/>
        <ButtonItem icon='thumbs-o-down' disabled={downvote}
          action={this.onDownvoteAction}/>
      </div>
    )
  }
}
