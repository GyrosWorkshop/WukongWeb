import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import style from './downvote-button.css'

function mapStateToProps(state) {
  return {
    downvote: state.player.downvote
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchDownvote() {
      dispatch(Action.Player.downvote.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class DownvoteButton extends PureComponent {
  static propTypes = {
    downvote: PropTypes.bool,
    dispatchDownvote: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchDownvote()
  }

  render() {
    const {downvote} = this.props
    return (
      <ButtonItem icon='thumbs-o-down' disabled={downvote}
        action={this.onButtonAction}>
        <p>Downvote Song</p>
      </ButtonItem>
    )
  }
}
