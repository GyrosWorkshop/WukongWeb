import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import Action from '../action'
import FlatButton from './flat-button'

function mapStateToProps(state) {
  return {
    running: state.player.running
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchReload() {
      dispatch(Action.Player.reload.create(true))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ReloadButton extends PureComponent {
  static propTypes = {
    running: PropTypes.bool,
    dispatchReload: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchReload()
  }

  render() {
    const {running} = this.props
    return (
      <FlatButton icon='refresh' hidden={running}
        action={this.onButtonAction}>
        <p>Reload Song</p>
      </FlatButton>
    )
  }
}
