import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './channel-title.css'

function mapStateToProps(state) {
  return {
    channel: state.channel.name
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ChannelTitle extends PureComponent {
  static propTypes = {
    channel: PropTypes.string
  }

  render() {
    const {channel} = this.props
    return (
      <div styleName='container'>
        <p>
          <Link to='/'>Wukong</Link>
          #<Link to={`/${channel}`}>{channel}</Link>
        </p>
      </div>
    )
  }
}
