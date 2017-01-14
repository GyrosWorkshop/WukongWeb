import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import style from './button-bar.css'

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
    return (
      <div styleName='container'>
        <ButtonItem icon='refresh'/>
        <ButtonItem icon='refresh'/>
        <ButtonItem icon='refresh'/>
      </div>
    )
  }
}
