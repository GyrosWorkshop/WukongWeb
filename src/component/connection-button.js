import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {Action} from '../client'
import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {
    connection: state.user.preferences.connection
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchConnection(connection) {
      dispatch(Action.User.preferences.create({connection}))
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
class ConnectionButton extends PureComponent {
  static propTypes = {
    connection: PropTypes.number,
    dispatchConnection: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchConnection((this.props.connection + 1) % 2)
  }

  render() {
    const {connection} = this.props
    return (
      <ButtonItem icon={connection ? 'chain' : 'chain-broken'}
        action={this.onButtonAction}>
        <p>Use CDN: {connection ? 'On' : 'Off'}</p>
      </ButtonItem>
    )
  }
}
