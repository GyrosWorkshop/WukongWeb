import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import style from './reload-button.css'

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
@CSSModules(style)
export default class ReloadButton extends PureComponent {
  static propTypes = {
    running: PropTypes.bool,
    dispatchReload: PropTypes.func
  }

  onReloadAction = (event) => {
    this.props.dispatchReload()
  }

  render() {
    const {running} = this.props
    return !running && (
      <button styleName='button' onTouchTap={this.onReloadAction}>
        <i className='fa fa-refresh'/>
      </button>
    )
  }
}
