import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {Action} from '../client'
import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchSync() {
      dispatch(Action.Song.sync.create())
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
class SyncButton extends PureComponent {
  static propTypes = {
    dispatchSync: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchSync()
  }

  render() {
    return (
      <ButtonItem icon='cloud-download' action={this.onButtonAction}>
        <p>Sync</p>
      </ButtonItem>
    )
  }
}
